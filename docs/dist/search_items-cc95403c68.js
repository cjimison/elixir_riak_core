searchNodes=[{"doc":"Module to interact with the VNode module given to the Riax.Supervisor module","ref":"Riax.html","title":"Riax","type":"module"},{"doc":"Same as sync_command/3 but does not block the Master VNode's process. That is, it lets the Master VNode handle multiple requests concurrently.","ref":"Riax.html#async_command/3","title":"Riax.async_command/3","type":"function"},{"doc":"Works like sync_command/3, but does not generate a response from the VNode that handles the request. In that way, it's similar to how GenServer.cast/2 works. Following sync_comand/3's example, its usage would be like this: iex ( dev1 @ 127.0 . 0.1 ) 3 &gt; Riax . cast_command ( 1 , &quot;riax&quot; , { :ping , 1 } ) :ok 13 : 36 : 19.742 [ debug ] Received ping command! As you can see, the VNode does handle the request and logs it, but we only get an :ok as return value, like GenServer.cast/2.","ref":"Riax.html#cast_command/3","title":"Riax.cast_command/3","type":"function"},{"doc":"Execute a command across every available VNode. This will start the coverage FSM (implemented in Riax.Coverage.Fsm ), via the coverage supervisor, and gather the results from every VNode. Be careful, coverage commands can be quite expensive. The results are gathered as a list of 3 tuple elements: {partition, node, data} Parameters: command: Command for the VNode, should match the first argument of a ` handle_coverage / 4 ` definition from your VNode . timeout: timeout in microseconds, 5000 by default. Example: Let's say we want to call this function: def handle_coverage ( :keys , _key_spaces , { _ , req_id , _ } , state = %{ data : data } ) do keys = Map . keys ( data ) { :reply , { req_id , keys } , state } end Then, we must do: iex ( dev2 @ 127.0 . 0.1 ) 6 &gt; Riax . coverage_command ( :keys ) 14 : 25 : 33.084 [ info ] Starting coverage request 74812649 keys { :ok , [ { 1027618338748291114361965898003636498195577569280 , :&quot;dev2@127.0.0.1&quot; , &#39; &#39; } , { 936274486415109681974235595958868809467081785344 , :&quot;dev2@127.0.0.1&quot; , [ 22 ] } , { 1415829711164312202009819681693899175291684651008 , :&quot;dev2@127.0.0.1&quot; , &#39;E&#39; } , { 1392993748081016843912887106182707253109560705024 , :&quot;dev2@127.0.0.1&quot; , &#39;AV&#39; } , { 959110449498405040071168171470060731649205731328 , :&quot;dev2@127.0.0.1&quot; , &#39;CZ&#39; } , ... ]","ref":"Riax.html#coverage_command/2","title":"Riax.coverage_command/2","type":"function"},{"doc":"Join the running node with the given argument node. This will automatically trigger the handoff - the nodes will start distributing partitions (and therefore, keys) between them. See the ring_status/0 example.","ref":"Riax.html#join/1","title":"Riax.join/1","type":"function"},{"doc":"This is actually the head of the Active Preference List: a list of the available VNodes to handle a given request. We always use the first available one. The VNode is represented and returned as: {index, node_name}. The first element denotes the first key in the partition the vnode is responsible for (as an integer), and the second element refers to the (physical) node the vnode is running on. Parameters: key: can be any erlang term, but it is recommended to use numbers or strings. bucket: is the name of the bucket for this key. A bucket is a &quot;namespace&quot; for a given Key. Check this for more.","ref":"Riax.html#preferred_node/2","title":"Riax.preferred_node/2","type":"function"},{"doc":"Like preferred_node/2 , but returns only the node's name.","ref":"Riax.html#preferred_node_name/2","title":"Riax.preferred_node_name/2","type":"function"},{"doc":"Prints the ring status . The ring is, basically, a representation of the partitioned keys over nodes. Here's a visual representation of said ring Example: Join 2 running nodes and print the ring, to see the key distribution (handoff) result: iex ( dev2 @ 127.0 . 0.1 ) 3 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 64 ( 100.0 % ) dev2 @ 127.0 . 0.1 === === === === === === === === === === === === Ring === === === === === === === === === === === === = aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | :ok iex ( dev2 @ 127.0 . 0.1 ) 13 &gt; Riax . join ( &#39;dev1@127.0.0.1&#39; ) 13 : 51 : 21.258 [ debug ] Handoff starting with target : { :hinted , { 913438523331814323877303020447676887284957839360 , :&quot;dev1@127.0.0.1&quot; } } ... iex ( dev2 @ 127.0 . 0.1 ) 6 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 64 ( 100.0 % ) dev1 @ 127.0 . 0.1 Node b : 0 ( 0.0 % ) dev2 @ 127.0 . 0.1 ... # After a little while, run the command again # to check the ring status. iex ( dev2 @ 127.0 . 0.1 ) 11 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 32 ( 50.0 % ) dev1 @ 127.0 . 0.1 Node b : 32 ( 50.0 % ) dev2 @ 127.0 . 0.1 === === === === === === === === === === === === Ring === === === === === === === === === === === === = abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba |","ref":"Riax.html#ring_status/0","title":"Riax.ring_status/0","type":"function"},{"doc":"Use the VNode master to send a synchronous command to the VNode that receives the key. Keep in mind this blocks the Master VNode's process, and will not be able multiple requests concurrently. Parameters: key: Can be any erlang term, but it is recommended to use a number or a binary. This is used to determine on which partition will end up, and therefore which VNode handles the command. bucket: Is the name of the bucket for this key. command: The command to send to the VNode. This will try to match with the defined handle_command/3 clause in the VNode module. Example: Let's say we have this function in our VNode module: def handle_command ( { :ping , v } , _sender , _state ) do Logger . debug ( &quot;Received ping command!&quot; , state ) { :reply , { :pong , v + 1 , node ( ) , partition } , state } end We can interact with it like this: iex ( dev1 @ 127.0 . 0.1 ) &gt; Riax . sync_command ( 1 , &quot;riax&quot; , { :ping , 1 } ) 13 : 13 : 08.004 [ debug ] Received ping command! { :pong , 2 , :&quot;dev1@127.0.0.1&quot; , 822094670998632891489572718402909198556462055424 }","ref":"Riax.html#sync_command/3","title":"Riax.sync_command/3","type":"function"},{"doc":"This module handles coverage commands. That is, a command that runs across every available Virtual Node, and gathers their answers.","ref":"Riax.Coverage.Fsm.html","title":"Riax.Coverage.Fsm","type":"module"},{"doc":"Callback implementation for :riak_core_coverage_fsm.finish/2 .","ref":"Riax.Coverage.Fsm.html#finish/2","title":"Riax.Coverage.Fsm.finish/2","type":"function"},{"doc":"Callback implementation for :riak_core_coverage_fsm.init/2 .","ref":"Riax.Coverage.Fsm.html#init/2","title":"Riax.Coverage.Fsm.init/2","type":"function"},{"doc":"Callback implementation for :riak_core_coverage_fsm.process_results/2 .","ref":"Riax.Coverage.Fsm.html#process_results/2","title":"Riax.Coverage.Fsm.process_results/2","type":"function"},{"doc":"","ref":"Riax.Coverage.Fsm.html#start_link/4","title":"Riax.Coverage.Fsm.start_link/4","type":"function"},{"doc":"Starts the Coverage Full State Machine","ref":"Riax.Coverage.Sup.html","title":"Riax.Coverage.Sup","type":"module"},{"doc":"Returns a specification to start this module under a supervisor. See Supervisor .","ref":"Riax.Coverage.Sup.html#child_spec/1","title":"Riax.Coverage.Sup.child_spec/1","type":"function"},{"doc":"Callback implementation for DynamicSupervisor.init/1 .","ref":"Riax.Coverage.Sup.html#init/1","title":"Riax.Coverage.Sup.init/1","type":"function"},{"doc":"","ref":"Riax.Coverage.Sup.html#start_fsm/1","title":"Riax.Coverage.Sup.start_fsm/1","type":"function"},{"doc":"","ref":"Riax.Coverage.Sup.html#start_link/0","title":"Riax.Coverage.Sup.start_link/0","type":"function"},{"doc":"Supervisor that spawns the Riak VNode Master and Coverage Supervisor.","ref":"Riax.Supervisor.html","title":"Riax.Supervisor","type":"module"},{"doc":"Returns a specification to start this module under a supervisor. See Supervisor .","ref":"Riax.Supervisor.html#child_spec/1","title":"Riax.Supervisor.child_spec/1","type":"function"},{"doc":"Callback implementation for Supervisor.init/1 .","ref":"Riax.Supervisor.html#init/1","title":"Riax.Supervisor.init/1","type":"function"},{"doc":"","ref":"Riax.Supervisor.html#start_link/1","title":"Riax.Supervisor.start_link/1","type":"function"},{"doc":"A virtual node is an Elixir (or Erlang) process responsible for a partition of keys from the ring . The key word here is virtual (as opposed to physical), because we can have many virtual nodes running on a physical node. In the picture, the colored squares are physical nodes. With consistent hashing, we can determine which node should handle a given key, depending on which partition (and therefore, VNode) the key ends up. The way that keys are distributed is the Handoff, which is explained on a section below. The virtual node is responsible for handling requests and can store data to be retrieved. It is important to bear in mind that VNodes are not bound to a particular to a particular physical node. They can be relocated to another physical nodes as new nodes are added (using Riax.join) or a certain physical node is not available. Adding new nodes easily is useful for horizontal scaling. To implement this Virtual Node, we provide an easy to use behaviour. Here's an example of using a Virtual Node as a Key-Value store. Example defmodule Riax.VNode.Impl do require Logger @behaviour Riax.VNode def init ( [ partition ] ) do { :ok , %{ partition : partition , data : %{ } } } end def handle_command ( { :ping , v } , _sender , state = %{ partition : partition } ) do Logger . debug ( &quot;Received ping command!&quot; , state ) { :reply , { :pong , v + 1 , node ( ) , partition } , state } end def handle_command ( { :put , :no_log , { k , v } } , _sender , state = %{ data : data } ) do new_data = Map . put ( data , k , v ) { :reply , :ok , %{ state | data : new_data } } end def handle_command ( { :put , { k , v } } , _sender , state = %{ data : data } ) do Logger . debug ( &quot;PUT Key: \#{ inspect ( k ) } , Value: \#{ inspect ( v ) } &quot; , state ) new_data = Map . put ( data , k , v ) { :reply , :ok , %{ state | data : new_data } } end def handle_command ( { :get , key } , _sender , state = %{ data : data } ) do Logger . debug ( &quot;GET \#{ key } &quot; , state ) reply = case Map . get ( data , key ) do nil -&gt; :not_found value -&gt; value end { :reply , reply , state } end def handle_command ( { :delete , key } , _sender , state = %{ data : data } ) do Logger . debug ( &quot;DELETE \#{ inspect ( key ) } &quot; , state ) new_data = Map . delete ( data , key ) { :reply , Map . get ( data , key , :not_found ) , %{ state | data : new_data } } end def handle_command ( message , _sender , state ) do Logger . debug ( &quot;unhandle command \#{ inspect ( message ) } &quot; ) { :noreply , state } end def handoff_starting ( target_node , state = %{ partition : _partition } ) do Logger . debug ( &quot;Handoff starting with target: \#{ inspect ( target_node ) } - State: \#{ inspect ( state ) } &quot; ) { true , state } end def handoff_finished ( dest , state = %{ partition : partition } ) do Logger . debug ( &quot;Handoff finished with target: \#{ inspect ( dest ) } , partition: \#{ inspect ( partition ) } &quot; ) { :ok , state } end def handle_handoff_fold ( fold_function , acc , _sender , state ) when is_function ( fold_function ) do Logger . debug ( &quot;&gt;&gt;&gt;&gt;&gt; Handoff V2 &lt;&lt;&lt;&lt;&lt;&lt;&quot; ) acc = state . data |&gt; Enum . reduce ( acc , fn { k , v } , acc -&gt; fold_function . ( k , v , acc ) end ) { :reply , acc , state } end def handle_handoff_command ( request , sender , state ) do handle_command ( request , sender , state ) end def is_empty ( state ) do is_empty = map_size ( state ) == 0 { is_empty , state } end def delete ( state ) do Logger . debug ( &quot;Deleting the vnode data&quot; ) { :ok , %{ state | data : %{ } } } end def encode_handoff_item ( k , v ) do Logger . debug ( &quot;Encode handoff item: \#{ k } \#{ v } &quot; ) :erlang . term_to_binary ( { k , v } ) end def handle_handoff_data ( bin_data , state ) do Logger . debug ( &quot;Handle handoff data - bin_data: \#{ inspect ( bin_data ) } - \#{ inspect ( state ) } &quot; ) { k , v } = :erlang . binary_to_term ( bin_data ) new_state = Map . update ( state , :data , %{ } , fn data -&gt; Map . put ( data , k , v ) end ) { :reply , :ok , new_state } end def handle_coverage ( :keys , _key_spaces , { _ , req_id , _ } , state = %{ data : data } ) do Logger . debug ( &quot;Received keys coverage: \#{ inspect ( state ) } &quot; ) keys = Map . keys ( data ) { :reply , { req_id , keys } , state } end def handle_coverage ( :values , _key_spaces , { _ , req_id , _ } , state = %{ data : data } ) do Logger . debug ( &quot;Received values coverage: \#{ inspect ( state ) } &quot; ) values = Map . values ( data ) { :reply , { req_id , values } , state } end def handle_coverage ( :clear , _key_spaces , { _ , req_id , _ } , state ) do Logger . debug ( &quot;Received clear coverage: \#{ inspect ( state ) } &quot; ) new_state = %{ state | data : %{ } } { :reply , { req_id , [ ] } , new_state } end def handle_exit ( pid , reason , state ) do Logger . error ( &quot;Handling exit: self: \#{ inspect ( self ( ) ) } - pid: \#{ inspect ( pid ) } - reason: \#{ inspect ( reason ) } - state: \#{ inspect ( state ) } &quot; ) { :noreply , state } end def handoff_cancelled ( state ) do Logger . error ( &quot;Handoff cancelled with state: \#{ state } &quot; ) { :ok , state } end end If our setup is working, we can call it using the Riax module Example: iex ( dev1 @ 127.0 . 0.1 ) &gt; Riax . sync_command 1 , { :ping , 1 } 17 : 05 : 35.559 [ debug ] Received ping command! { :pong , 2 , :&quot;dev1@127.0.0.1&quot; , 822094670998632891489572718402909198556462055424 } iex ( dev1 @ 127.0 . 0.1 ) 2 &gt; Riax . sync_command ( :some_identifier , { :put , { :my_key , :my_value } } ) 17 : 09 : 57.727 [ debug ] PUT Key : :my_key , Value : :my_value :ok iex ( dev1 @ 127.0 . 0.1 ) 3 &gt; Riax . sync_command ( :some_identifier , { :get , :my_key } ) 17 : 10 : 11.336 [ debug ] GET my_key :my_value iex ( dev1 @ 127.0 . 0.1 ) 4 &gt; Riax . preferred_node ( :some_identifier ) { :ok , { 639406966332270026714112114313373821099470487552 , :&quot;dev1@127.0.0.1&quot; } } This tells us the key :my_key and value :my_value pair ended up in the Virtual Node :&quot;dev1@127.0.0.1&quot; Handoff : Ownership of a partition (that is, key distribution between nodes) may be transferred from one virtual node to another in a different node when nodes join (via Riax.join/1 ) or are removed from the cluster, and under certain failure scenarios to guarantee high availability. If a node goes down unexpectedly, the partitions owned by the virtual nodes it contained will be temporarily handled by virtual nodes in other physical nodes. If the original node comes back up, ownership will eventually be transferred back to the original owners, also called primary virtual nodes. The virtual nodes that took over ownership in that scenario are called secondary virtual nodes. The process by which this ownership is negotiated and any relevant data is transferred to accomplish that is what we call a handoff. Transfer of ownership may also occur when adding or removing physical nodes to the cluster. Handoff process: First of all, keep in mind that when the handoff is in progress, a VNode will handle its requests via handle_handoff_command/3 , it can drop the request, forward it or handle it. When the handoff starts it works like this: The callback handoff_starting/2 is called. If it returns a {:false, state} tuple, the handoff is cancelled. Else, it calls is_empty/1 to check if the VNode has something to hand off. If is_empty/1 it returns a :false tuple, the handoff continues handle_handoff_fold/3 is called with a folding function and an accumulator as parameters. The provided accumulator works just fine with the Enum module. The given fold_function turns the VNode's state into key-value pairs (see the example) and, before sending them to its corresponding Virtual Node, calls encode_handoff_item/2 to encode them. Said encoding will be then decoded by handle_handoff_data/2 in the receiving Virtual Node. When all the key-values are sent, handoff_finished/2 is called.","ref":"Riax.VNode.html","title":"Riax.VNode","type":"behaviour"},{"doc":"Callback implementation for :riak_core_vnode.delete/1 .","ref":"Riax.VNode.html#delete/1","title":"Riax.VNode.delete/1","type":"function"},{"doc":"Called when the VNode data is to be deleted. Can be used for a preemptive cleanup of the VNode.","ref":"Riax.VNode.html#c:delete/1","title":"Riax.VNode.delete/1","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.encode_handoff_item/2 .","ref":"Riax.VNode.html#encode_handoff_item/2","title":"Riax.VNode.encode_handoff_item/2","type":"function"},{"doc":"This function is called before sending data to another running VNode during a handoff. The key-value pairs returned by the fold_function given to handle_handoff_fold/4 will be encoded by this function.","ref":"Riax.VNode.html#c:encode_handoff_item/2","title":"Riax.VNode.encode_handoff_item/2","type":"callback"},{"doc":"","ref":"Riax.VNode.html#fold_req_v1/1","title":"Riax.VNode.fold_req_v1/1","type":"macro"},{"doc":"","ref":"Riax.VNode.html#fold_req_v1/2","title":"Riax.VNode.fold_req_v1/2","type":"macro"},{"doc":"","ref":"Riax.VNode.html#fold_req_v2/1","title":"Riax.VNode.fold_req_v2/1","type":"macro"},{"doc":"","ref":"Riax.VNode.html#fold_req_v2/2","title":"Riax.VNode.fold_req_v2/2","type":"macro"},{"doc":"Callback implementation for :riak_core_vnode.handle_command/3 .","ref":"Riax.VNode.html#handle_command/3","title":"Riax.VNode.handle_command/3","type":"function"},{"doc":"Responsible of answering commands sent with either Riax.sync_command/3 , Riax.async_command/3 or Riax.cast_command/3 . Parameters: request: The command to be handled. sender: The process sending the request. state: The VNode's current state. Keep in mind that sender is :ignored when using Riax.cast_command/3 .","ref":"Riax.VNode.html#c:handle_command/3","title":"Riax.VNode.handle_command/3","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.handle_coverage/4 .","ref":"Riax.VNode.html#handle_coverage/4","title":"Riax.VNode.handle_coverage/4","type":"function"},{"doc":"Handles a command given by the Riax.coverage_command/2 function.","ref":"Riax.VNode.html#c:handle_coverage/4","title":"Riax.VNode.handle_coverage/4","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.handle_exit/3 .","ref":"Riax.VNode.html#handle_exit/3","title":"Riax.VNode.handle_exit/3","type":"function"},{"doc":"Callback called in the case that a process linked to the VNode process dies and allows the module using the behaviour to take appropiate action.","ref":"Riax.VNode.html#c:handle_exit/3","title":"Riax.VNode.handle_exit/3","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.handle_handoff_command/3 .","ref":"Riax.VNode.html#handle_handoff_command/3","title":"Riax.VNode.handle_handoff_command/3","type":"function"},{"doc":"Like handle_handoff_command/3 but this function takes care of handling requests during a handoff. Return This callback can also eturn a tuple that has as its first element : reply, :noreply , : forward , :drop or :stop tuple. If the function returns :foward it forwards the request to another VNode, :drop drops the request. Useful if, for example, you don't want to handle requests during a handoff.","ref":"Riax.VNode.html#c:handle_handoff_command/3","title":"Riax.VNode.handle_handoff_command/3","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.handle_handoff_data/2 .","ref":"Riax.VNode.html#handle_handoff_data/2","title":"Riax.VNode.handle_handoff_data/2","type":"function"},{"doc":"When a handoff is in progress, data is received by the new vnode and must decode it and do something with it, this is done by this callback.","ref":"Riax.VNode.html#c:handle_handoff_data/2","title":"Riax.VNode.handle_handoff_data/2","type":"callback"},{"doc":"This function has the job of converting the VNode state into a key-value pair. These key-value pairs will be then encoded by the encode_handoff_item/2 callback. Parameters: fold_function: Function that reduces/folds the VNode's actual state into key-value pairs. acc: The initial accumulator for the fold_function. sender: The process sending the handoff request. state: VNode state. Return: The return values work just like in handle_handoff_command/3.","ref":"Riax.VNode.html#c:handle_handoff_fold/4","title":"Riax.VNode.handle_handoff_fold/4","type":"callback"},{"doc":"","ref":"Riax.VNode.html#handle_overload_command/3","title":"Riax.VNode.handle_overload_command/3","type":"function"},{"doc":"","ref":"Riax.VNode.html#handle_overload_info/2","title":"Riax.VNode.handle_overload_info/2","type":"function"},{"doc":"Callback implementation for :riak_core_vnode.handoff_cancelled/1 .","ref":"Riax.VNode.html#handoff_cancelled/1","title":"Riax.VNode.handoff_cancelled/1","type":"function"},{"doc":"This function is called when a handoff process affecting this vnode process gets cancelled. It can be used to undo changes made in handoff_starting/2.","ref":"Riax.VNode.html#c:handoff_cancelled/1","title":"Riax.VNode.handoff_cancelled/1","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.handoff_finished/2 .","ref":"Riax.VNode.html#handoff_finished/2","title":"Riax.VNode.handoff_finished/2","type":"function"},{"doc":"Called when a handoff finishes.","ref":"Riax.VNode.html#c:handoff_finished/2","title":"Riax.VNode.handoff_finished/2","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.handoff_starting/2 .","ref":"Riax.VNode.html#handoff_starting/2","title":"Riax.VNode.handoff_starting/2","type":"function"},{"doc":"Callback that is called when a handoff starts. See the Handoff Process section.","ref":"Riax.VNode.html#c:handoff_starting/2","title":"Riax.VNode.handoff_starting/2","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.init/1 .","ref":"Riax.VNode.html#init/1","title":"Riax.VNode.init/1","type":"function"},{"doc":"Set up VNode state and data structure. It recieves a list its assigned partition and should return the VNode's initial state.","ref":"Riax.VNode.html#c:init/1","title":"Riax.VNode.init/1","type":"callback"},{"doc":"Callback implementation for :riak_core_vnode.is_empty/1 .","ref":"Riax.VNode.html#is_empty/1","title":"Riax.VNode.is_empty/1","type":"function"},{"doc":"This callback is used to determine if the VNode's state data structure is empty.","ref":"Riax.VNode.html#c:is_empty/1","title":"Riax.VNode.is_empty/1","type":"callback"},{"doc":"","ref":"Riax.VNode.html#start_vnode/1","title":"Riax.VNode.start_vnode/1","type":"function"},{"doc":"Callback implementation for :riak_core_vnode.terminate/2 .","ref":"Riax.VNode.html#terminate/2","title":"Riax.VNode.terminate/2","type":"function"},{"doc":"","ref":"Riax.VNode.html#t:handoff_dest/0","title":"Riax.VNode.handoff_dest/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:keyspaces/0","title":"Riax.VNode.keyspaces/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:partition/0","title":"Riax.VNode.partition/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:sender/0","title":"Riax.VNode.sender/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:sender_type/0","title":"Riax.VNode.sender_type/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:vnode_req/0","title":"Riax.VNode.vnode_req/0","type":"type"},{"doc":"Example Implementation of a Virtual Node used as a K-V store, used for testing.","ref":"Riax.VNode.Impl.html","title":"Riax.VNode.Impl","type":"module"}]