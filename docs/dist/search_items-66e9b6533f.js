searchNodes=[{"doc":"This module provides the set of functions to communicate with your VNode implementation. To implement a VNode, check the Riax.VNode module documentation. For an example on how to setup and use Riax, check the tutorial section.","ref":"Riax.html","title":"Riax","type":"module"},{"doc":"Same as sync_command/3 but does not block the Master VNode's process. That is, it lets the Master VNode handle multiple requests concurrently.","ref":"Riax.html#async_command/3","title":"Riax.async_command/3","type":"function"},{"doc":"Works like sync_command/3, but does not generate a response from the VNode that handles the request. In that way, it's similar to how GenServer.cast/2 works. Following sync_comand/3's example, its usage would be like this: iex ( dev1 @ 127.0 . 0.1 ) 3 &gt; Riax . cast_command ( 1 , &quot;riax&quot; , { :ping , 1 } ) :ok 13 : 36 : 19.742 [ debug ] Received ping command! As you can see, the VNode does handle the request and logs it, but we only get an :ok as return value, like GenServer.cast/2.","ref":"Riax.html#cast_command/3","title":"Riax.cast_command/3","type":"function"},{"doc":"Execute a command across every available VNode. This will start the coverage FSM (implemented in Riax.Coverage.Fsm ), via the coverage supervisor, and gather the results from every VNode. Be careful, coverage commands can be quite expensive. The results are gathered as a list of 3 tuple elements: {partition, node, data} Parameters: command: Command for the VNode, should match the first argument of a ` handle_coverage / 4 ` definition from your VNode . timeout: timeout in microseconds, 5000 by default. Example: Let's say we want to call this function: def handle_coverage ( :keys , _key_spaces , { _ , req_id , _ } , state = %{ data : data } ) do keys = Map . keys ( data ) { :reply , { req_id , keys } , state } end Then, we must do: iex ( dev2 @ 127.0 . 0.1 ) 6 &gt; Riax . coverage_command ( :keys ) 14 : 25 : 33.084 [ info ] Starting coverage request 74812649 keys { :ok , [ { 1027618338748291114361965898003636498195577569280 , :&quot;dev2@127.0.0.1&quot; , &#39; &#39; } , { 936274486415109681974235595958868809467081785344 , :&quot;dev2@127.0.0.1&quot; , [ 22 ] } , { 1415829711164312202009819681693899175291684651008 , :&quot;dev2@127.0.0.1&quot; , &#39;E&#39; } , { 1392993748081016843912887106182707253109560705024 , :&quot;dev2@127.0.0.1&quot; , &#39;AV&#39; } , { 959110449498405040071168171470060731649205731328 , :&quot;dev2@127.0.0.1&quot; , &#39;CZ&#39; } , ... ]","ref":"Riax.html#coverage_command/2","title":"Riax.coverage_command/2","type":"function"},{"doc":"Join the running node with the given argument node. This will automatically trigger the handoff - the nodes will start distributing partitions (and therefore, keys) between them. See the ring_status/0 example.","ref":"Riax.html#join/1","title":"Riax.join/1","type":"function"},{"doc":"This is actually the head of the Active Preference List: a list of the available VNodes to handle a given request. We always use the first available one. The VNode is represented and returned as: {index, node_name}. The first element denotes the first key in the partition the vnode is responsible for (as an integer), and the second element refers to the (physical) node the vnode is running on. Parameters: key: can be any erlang term, but it is recommended to use numbers or strings. bucket: is the name of the bucket for this key. A bucket is a &quot;namespace&quot; for a given Key. Check this for more.","ref":"Riax.html#preferred_node/2","title":"Riax.preferred_node/2","type":"function"},{"doc":"Like preferred_node/2 , but returns only the node's name.","ref":"Riax.html#preferred_node_name/2","title":"Riax.preferred_node_name/2","type":"function"},{"doc":"Prints the ring status . The ring is, basically, a representation of the partitioned keys over nodes. Here's a visual representation of said ring Example: Join 2 running nodes and print the ring, to see the key distribution (handoff) result: iex ( dev2 @ 127.0 . 0.1 ) 3 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 64 ( 100.0 % ) dev2 @ 127.0 . 0.1 === === === === === === === === === === === === Ring === === === === === === === === === === === === = aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | :ok iex ( dev2 @ 127.0 . 0.1 ) 13 &gt; Riax . join ( &#39;dev1@127.0.0.1&#39; ) 13 : 51 : 21.258 [ debug ] Handoff starting with target : { :hinted , { 913438523331814323877303020447676887284957839360 , :&quot;dev1@127.0.0.1&quot; } } ... iex ( dev2 @ 127.0 . 0.1 ) 6 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 64 ( 100.0 % ) dev1 @ 127.0 . 0.1 Node b : 0 ( 0.0 % ) dev2 @ 127.0 . 0.1 ... # After a little while, run the command again # to check the ring status. iex ( dev2 @ 127.0 . 0.1 ) 11 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 32 ( 50.0 % ) dev1 @ 127.0 . 0.1 Node b : 32 ( 50.0 % ) dev2 @ 127.0 . 0.1 === === === === === === === === === === === === Ring === === === === === === === === === === === === = abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba | abba |","ref":"Riax.html#ring_status/0","title":"Riax.ring_status/0","type":"function"},{"doc":"Use the VNode master to send a synchronous command to the VNode that receives the key. Keep in mind this blocks the Master VNode's process, and will not be able multiple requests concurrently. Parameters: key: Can be any erlang term, but it is recommended to use a number or a binary. This is used to determine on which partition will end up, and therefore which VNode handles the command. bucket: Is the name of the bucket for this key. command: The command to send to the VNode. This will try to match with the defined handle_command/3 clause in the VNode module. Example: Let's say we have this function in our VNode module: def handle_command ( { :ping , v } , _sender , _state ) do Logger . debug ( &quot;Received ping command!&quot; , state ) { :reply , { :pong , v + 1 , node ( ) , partition } , state } end We can interact with it like this: iex ( dev1 @ 127.0 . 0.1 ) &gt; Riax . sync_command ( 1 , &quot;riax&quot; , { :ping , 1 } ) 13 : 13 : 08.004 [ debug ] Received ping command! { :pong , 2 , :&quot;dev1@127.0.0.1&quot; , 822094670998632891489572718402909198556462055424 }","ref":"Riax.html#sync_command/3","title":"Riax.sync_command/3","type":"function"},{"doc":"A virtual node is an Elixir (or Erlang) process responsible for a partition of keys from the ring . The key word here is virtual (as opposed to physical), because we can have many virtual nodes running on a physical node. In the picture, the colored squares are physical nodes. With consistent hashing, we can determine which node should handle a given key, depending on which partition (and therefore, VNode) the key ends up. The way that keys are distributed is the Handoff, which is explained on a section below. The virtual node is responsible for handling requests and can store data to be retrieved. It is important to bear in mind that VNodes are not bound to a particular to a particular physical node. They can be relocated to another physical nodes as new nodes are added (using Riax.join) or a certain physical node is not available. Adding new nodes easily is useful for horizontal scaling. To implement this Virtual Node, we provide an easy to use behaviour. Here's an example of using a Virtual Node as a Key-Value store. Example defmodule Riax.VNode.Impl do require Logger @behaviour Riax.VNode def init ( [ partition ] ) do { :ok , %{ partition : partition , data : %{ } } } end def handle_command ( { :ping , v } , _sender , state = %{ partition : partition } ) do Logger . debug ( &quot;Received ping command!&quot; , state ) { :reply , { :pong , v + 1 , node ( ) , partition } , state } end def handle_command ( { :put , :no_log , { k , v } } , _sender , state = %{ data : data } ) do new_data = Map . put ( data , k , v ) { :reply , :ok , %{ state | data : new_data } } end def handle_command ( { :put , { k , v } } , _sender , state = %{ data : data } ) do Logger . debug ( &quot;PUT Key: \#{ inspect ( k ) } , Value: \#{ inspect ( v ) } &quot; , state ) new_data = Map . put ( data , k , v ) { :reply , :ok , %{ state | data : new_data } } end def handle_command ( { :get , key } , _sender , state = %{ data : data } ) do Logger . debug ( &quot;GET \#{ key } &quot; , state ) reply = case Map . get ( data , key ) do nil -&gt; :not_found value -&gt; value end { :reply , reply , state } end def handle_command ( { :delete , key } , _sender , state = %{ data : data } ) do Logger . debug ( &quot;DELETE \#{ inspect ( key ) } &quot; , state ) new_data = Map . delete ( data , key ) { :reply , Map . get ( data , key , :not_found ) , %{ state | data : new_data } } end def handle_command ( message , _sender , state ) do Logger . debug ( &quot;unhandle command \#{ inspect ( message ) } &quot; ) { :noreply , state } end def handoff_starting ( target_node , state = %{ partition : _partition } ) do Logger . debug ( &quot;Handoff starting with target: \#{ inspect ( target_node ) } - State: \#{ inspect ( state ) } &quot; ) { true , state } end def handoff_finished ( dest , state = %{ partition : partition } ) do Logger . debug ( &quot;Handoff finished with target: \#{ inspect ( dest ) } , partition: \#{ inspect ( partition ) } &quot; ) { :ok , state } end def handle_handoff_fold ( fold_function , acc , _sender , state ) when is_function ( fold_function ) do Logger . debug ( &quot;&gt;&gt;&gt;&gt;&gt; Handoff V2 &lt;&lt;&lt;&lt;&lt;&lt;&quot; ) acc = state . data |&gt; Enum . reduce ( acc , fn { k , v } , acc -&gt; fold_function . ( k , v , acc ) end ) { :reply , acc , state } end def handle_handoff_command ( request , sender , state ) do handle_command ( request , sender , state ) end def is_empty ( state ) do is_empty = map_size ( state ) == 0 { is_empty , state } end def delete ( state ) do Logger . debug ( &quot;Deleting the vnode data&quot; ) { :ok , %{ state | data : %{ } } } end def encode_handoff_item ( k , v ) do Logger . debug ( &quot;Encode handoff item: \#{ k } \#{ v } &quot; ) :erlang . term_to_binary ( { k , v } ) end def handle_handoff_data ( bin_data , state ) do Logger . debug ( &quot;Handle handoff data - bin_data: \#{ inspect ( bin_data ) } - \#{ inspect ( state ) } &quot; ) { k , v } = :erlang . binary_to_term ( bin_data ) new_state = Map . update ( state , :data , %{ } , fn data -&gt; Map . put ( data , k , v ) end ) { :reply , :ok , new_state } end def handle_coverage ( :keys , _key_spaces , { _ , req_id , _ } , state = %{ data : data } ) do Logger . debug ( &quot;Received keys coverage: \#{ inspect ( state ) } &quot; ) keys = Map . keys ( data ) { :reply , { req_id , keys } , state } end def handle_coverage ( :values , _key_spaces , { _ , req_id , _ } , state = %{ data : data } ) do Logger . debug ( &quot;Received values coverage: \#{ inspect ( state ) } &quot; ) values = Map . values ( data ) { :reply , { req_id , values } , state } end def handle_coverage ( :clear , _key_spaces , { _ , req_id , _ } , state ) do Logger . debug ( &quot;Received clear coverage: \#{ inspect ( state ) } &quot; ) new_state = %{ state | data : %{ } } { :reply , { req_id , [ ] } , new_state } end def handle_exit ( pid , reason , state ) do Logger . error ( &quot;Handling exit: self: \#{ inspect ( self ( ) ) } - pid: \#{ inspect ( pid ) } - reason: \#{ inspect ( reason ) } - state: \#{ inspect ( state ) } &quot; ) { :noreply , state } end def handoff_cancelled ( state ) do Logger . error ( &quot;Handoff cancelled with state: \#{ state } &quot; ) { :ok , state } end end If our setup is working, we can call it using the Riax module Example: iex ( dev1 @ 127.0 . 0.1 ) &gt; Riax . sync_command 1 , { :ping , 1 } 17 : 05 : 35.559 [ debug ] Received ping command! { :pong , 2 , :&quot;dev1@127.0.0.1&quot; , 822094670998632891489572718402909198556462055424 } iex ( dev1 @ 127.0 . 0.1 ) 2 &gt; Riax . sync_command ( :some_identifier , { :put , { :my_key , :my_value } } ) 17 : 09 : 57.727 [ debug ] PUT Key : :my_key , Value : :my_value :ok iex ( dev1 @ 127.0 . 0.1 ) 3 &gt; Riax . sync_command ( :some_identifier , { :get , :my_key } ) 17 : 10 : 11.336 [ debug ] GET my_key :my_value iex ( dev1 @ 127.0 . 0.1 ) 4 &gt; Riax . preferred_node ( :some_identifier ) { :ok , { 639406966332270026714112114313373821099470487552 , :&quot;dev1@127.0.0.1&quot; } } This tells us the key :my_key and value :my_value pair ended up in the Virtual Node :&quot;dev1@127.0.0.1&quot; Handoff : Ownership of a partition (that is, key distribution between nodes) may be transferred from one virtual node to another in a different node when nodes join (via Riax.join/1 ) or are removed from the cluster, and under certain failure scenarios to guarantee high availability. If a node goes down unexpectedly, the partitions owned by the virtual nodes it contained will be temporarily handled by virtual nodes in other physical nodes. If the original node comes back up, ownership will eventually be transferred back to the original owners, also called primary virtual nodes. The virtual nodes that took over ownership in that scenario are called secondary virtual nodes. The process by which this ownership is negotiated and any relevant data is transferred to accomplish that is what we call a handoff. Transfer of ownership may also occur when adding or removing physical nodes to the cluster. Handoff process: First of all, keep in mind that when the handoff is in progress, a VNode will handle its requests via handle_handoff_command/3 , it can drop the request, forward it or handle it. When the handoff starts it works like this: The callback handoff_starting/2 is called. If it returns a {:false, state} tuple, the handoff is cancelled. Else, it calls is_empty/1 to check if the VNode has something to hand off. If is_empty/1 it returns a :false tuple, the handoff continues handle_handoff_fold/3 is called with a folding function and an accumulator as parameters. The provided accumulator works just fine with the Enum module. The given fold_function turns the VNode's state into key-value pairs (see the example) and, before sending them to its corresponding Virtual Node, calls encode_handoff_item/2 to encode them. Said encoding will be then decoded by handle_handoff_data/2 in the receiving Virtual Node. When all the key-values are sent, handoff_finished/2 is called.","ref":"Riax.VNode.html","title":"Riax.VNode","type":"behaviour"},{"doc":"Called when the VNode data is to be deleted. Can be used for a preemptive cleanup of the VNode.","ref":"Riax.VNode.html#c:delete/1","title":"Riax.VNode.delete/1","type":"callback"},{"doc":"This function is called before sending data to another running VNode during a handoff. The key-value pairs returned by the fold_function given to handle_handoff_fold/4 will be encoded by this function.","ref":"Riax.VNode.html#c:encode_handoff_item/2","title":"Riax.VNode.encode_handoff_item/2","type":"callback"},{"doc":"","ref":"Riax.VNode.html#fold_req_v1/2","title":"Riax.VNode.fold_req_v1/2","type":"macro"},{"doc":"","ref":"Riax.VNode.html#fold_req_v2/2","title":"Riax.VNode.fold_req_v2/2","type":"macro"},{"doc":"Responsible of answering commands sent with either Riax.sync_command/3 , Riax.async_command/3 or Riax.cast_command/3 . Parameters: request: The command to be handled. sender: The process sending the request. state: The VNode's current state. Keep in mind that sender is :ignored when using Riax.cast_command/3 .","ref":"Riax.VNode.html#c:handle_command/3","title":"Riax.VNode.handle_command/3","type":"callback"},{"doc":"Handles a command given by the Riax.coverage_command/2 function.","ref":"Riax.VNode.html#c:handle_coverage/4","title":"Riax.VNode.handle_coverage/4","type":"callback"},{"doc":"Callback called in the case that a process linked to the VNode process dies and allows the module using the behaviour to take appropiate action.","ref":"Riax.VNode.html#c:handle_exit/3","title":"Riax.VNode.handle_exit/3","type":"callback"},{"doc":"Like handle_handoff_command/3 but this function takes care of handling requests during a handoff. Return This callback can also eturn a tuple that has as its first element : reply, :noreply , : forward , :drop or :stop tuple. If the function returns :foward it forwards the request to another VNode, :drop drops the request. Useful if, for example, you don't want to handle requests during a handoff.","ref":"Riax.VNode.html#c:handle_handoff_command/3","title":"Riax.VNode.handle_handoff_command/3","type":"callback"},{"doc":"When a handoff is in progress, data is received by the new vnode and must decode it and do something with it, this is done by this callback.","ref":"Riax.VNode.html#c:handle_handoff_data/2","title":"Riax.VNode.handle_handoff_data/2","type":"callback"},{"doc":"This function has the job of converting the VNode state into a key-value pair. These key-value pairs will be then encoded by the encode_handoff_item/2 callback. Parameters: fold_function: Function that reduces/folds the VNode's actual state into key-value pairs. acc: The initial accumulator for the fold_function. sender: The process sending the handoff request. state: VNode state. Return: The return values work just like in handle_handoff_command/3.","ref":"Riax.VNode.html#c:handle_handoff_fold/4","title":"Riax.VNode.handle_handoff_fold/4","type":"callback"},{"doc":"This function is called when a handoff process affecting this vnode process gets cancelled. It can be used to undo changes made in handoff_starting/2.","ref":"Riax.VNode.html#c:handoff_cancelled/1","title":"Riax.VNode.handoff_cancelled/1","type":"callback"},{"doc":"Called when a handoff finishes.","ref":"Riax.VNode.html#c:handoff_finished/2","title":"Riax.VNode.handoff_finished/2","type":"callback"},{"doc":"Callback that is called when a handoff starts. See the Handoff Process section.","ref":"Riax.VNode.html#c:handoff_starting/2","title":"Riax.VNode.handoff_starting/2","type":"callback"},{"doc":"Set up VNode state and data structure. It recieves a list its assigned partition and should return the VNode's initial state.","ref":"Riax.VNode.html#c:init/1","title":"Riax.VNode.init/1","type":"callback"},{"doc":"This callback is used to determine if the VNode's state data structure is empty.","ref":"Riax.VNode.html#c:is_empty/1","title":"Riax.VNode.is_empty/1","type":"callback"},{"doc":"","ref":"Riax.VNode.html#start_vnode/1","title":"Riax.VNode.start_vnode/1","type":"function"},{"doc":"","ref":"Riax.VNode.html#t:handoff_dest/0","title":"Riax.VNode.handoff_dest/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:keyspaces/0","title":"Riax.VNode.keyspaces/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:partition/0","title":"Riax.VNode.partition/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:sender/0","title":"Riax.VNode.sender/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:sender_type/0","title":"Riax.VNode.sender_type/0","type":"type"},{"doc":"","ref":"Riax.VNode.html#t:vnode_req/0","title":"Riax.VNode.vnode_req/0","type":"type"},{"doc":"Riax is an Elixir wrapper for Riak Core . Riak Core is a building block for distributed and scalable systems in the form of an Erlang Framework. To learn more about Riak you can check the Riak Core and useful links section sections. To learn more about Riax, check the setup , the tutorial or the API Reference . docs for more. If you want to set it up with Erlang, we also have an up-to-date (OTP 25) tutorial .","ref":"readme.html","title":"Riax","type":"extras"},{"doc":"iex ( dev1 @ 127.0 . 0.1 ) 1 &gt; #### Check the Ring Status iex ( dev1 @ 127.0 . 0.1 ) 2 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 64 ( 100.0 % ) dev1 @ 127.0 . 0.1 === === === === === === === === === === === === Ring === === === === === === === === === === === === = aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | :ok iex ( dev1 @ 127.0 . 0.1 ) 3 &gt; #### Join an already running Node iex ( dev1 @ 127.0 . 0.1 ) 4 &gt; Riax . join ( &#39;dev2@127.0.0.1&#39; ) 13 : 51 : 21.258 [ debug ] Handoff starting with target : { :hinted , { 913438523331814323877303020447676887284957839360 , :&quot;dev2@127.0.0.1&quot; } } iex ( dev1 @ 127.0 . 0.1 ) 5 &gt; #### Send a command to a VNode iex ( dev1 @ 127.0 . 0.1 ) 6 &gt; Riax . sync_command ( 1 , &quot;riax&quot; , { :ping , 1 } ) 13 : 13 : 08.004 [ debug ] Received ping command! { :pong , 2 , :&quot;dev1@127.0.0.1&quot; , 822094670998632891489572718402909198556462055424 }","ref":"readme.html#use-example","title":"Riax - Use example:","type":"extras"},{"doc":"","ref":"readme.html#riak-core","title":"Riax - Riak Core","type":"extras"},{"doc":"It is based on the Dynamo architecture , meaning it is easy to scale horizontally and distributes work in a decentralized manner. The great thing about Riak it's that it provides this architecture as a reusable Erlang library, meaning it can be used in any context that benefits from a decentralized distribution of work.","ref":"readme.html#what-is-it","title":"Riax - What is it?","type":"extras"},{"doc":"You must be thinking &quot;ok, fine, this is an Erlang lib, I'll use it directly&quot;. The setup of Riak Core can be tricky, specially from Elixir, this library takes care of all the gory details for you - we suffered so you don't have to.","ref":"readme.html#why-riax","title":"Riax - Why Riax?","type":"extras"},{"doc":"The key here is that Riak Core provides Consistent Hashing and Virtual Nodes. Virtual Nodes distribute work between them, and Consistent Hashing lets us route commands to these Virtual Nodes. Note that many Virtual Nodes can run in a Physical Node (i.e. a physical server) and can be easily set up or taken down. Plus, the only thing that you have to do using this library is giving them names and implement a behaviour, Riak handles the rest for you.","ref":"readme.html#what-s-so-great-about-it","title":"Riax - What's so great about it?","type":"extras"},{"doc":"The most intuitive and straight-forward use case is a key-value store in memory, we've actually implemented one here for our tests. A game server which handles requests from players could partition players through said hashing to handle load, and ensure that players requests are always handled on the same Virtual Node to ensure data locality. A distributed batch job handling system could also use consistent hashing and routing to ensure jobs from the same batch are always handled by the same node, or distribute the jobs across several partitions and then use the distributed map-reduce queries to gather results. Another example: Think about serving a dataset which you want quick access to, but It's too big to fit in memory. We could distribute said files (or file) between Virtual Nodes, use an identifier (say, like an index) hash it and assign it to a Virtual Node. Riak fits really well here as it scales easily horizontally. This last use case is actually explained below.","ref":"readme.html#use-cases","title":"Riax - Use cases","type":"extras"},{"doc":"Before performing an operation, a hashing function is applied to some data, a key. The key hash will be used to decide which node in the cluster should be responsible for executing the operation. The range of possible values the key hash can take (the keyspace, usually depicted as a ring), is partitioned in equally sized buckets, which are assigned to Virtual Vodes. Virtual Nodes share what is called a keyspace. The number of VNodes is fixed at cluster creation and a given hash value will always belong to the same partition (i.e. the same VNode). The VNodes in turn are evenly distributed across all available physical nodes. Note this distribution isn't fixed as the keyspace partitioning is: the VNode distribution can change if a physical node is added to the cluster or goes down. After this, be sure to check the tutorial to see this in action","ref":"readme.html#more-about-hashing-and-vnodes","title":"Riax - More about Hashing and VNodes","type":"extras"},{"doc":"Introducing Riak Core Riak Core Wiki Masterless Distributed Computing with Riak Core Ryan Zezeski's &quot;working&quot; blog: First, multinode and The vnode Little Riak Core Book riak_core in Elixir: Part I , Part II , Part III , Part IV and Part V A Gentle Introduction to Riak Core Understanding Riak Core: Handoff , Building Handoff and The visit fun udon_ng example application.","ref":"readme.html#useful-links","title":"Riax - Useful links","type":"extras"},{"doc":"We tested this with Elixir 1.13 and OTP 25.","ref":"setup.html","title":"Setup","type":"extras"},{"doc":"First, add Riax as a dependency to your mix.exs defp deps do [ { :riax , &quot;&gt;= 0.1.0&quot; , github : &quot;lambdaclass/elixir_riak_core&quot; , branch : &quot;main&quot; } ] end (It's not available on hex.pm as every dependency of Riak Core, and Riak itself, is hosted on Github. And hex.pm does not allow to upload packages with git dependencies) Then, you'll need a VNode implementation, you can grab mine if you want to. This is an example of a Virtual Node being used as Key-Value store. You can add it under lib/ or any other folder under elixirc_paths. After that, you'll need a configuration for each Node, here's an example one: # config/config.exs import Config # This tells riax which of or modules # implements a VNode. config :riax , vnode : Riax.VNode.Impl config :riak_core , # Must be an Erlang long name node : &#39;dev@127.0.0.1&#39; , web_port : 8198 , # Handoff is something we discuss # further in the Riax.VNode doc. handoff_port : 8199 , # Where to save this node&#39;s ring # state ring_state_dir : &#39;ring_data_dir_1&#39; , platform_data_dir : &#39;data_1&#39; , # This is a config file for Riak Core, # we provide this one for you. schema_dirs : [ &#39;/deps/riax/priv&#39; ] Remember that the iex node name needs to match the one from your config, so now you can start your mix project with: iex --name dev@127.0.0.1 -S mix run ``` And then, try running Riax.ring_status/0 in iex, you should see something like this: iex ( dev @ 127.0 . 0.1 ) 1 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 64 ( 100.0 % ) dev @ 127.0 . 0.1 === === === === === === === === === === === === Ring === === === === === === === === === === === === = aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | aaaa | :ok That's it! Up and running.","ref":"setup.html#single-node","title":"Setup - Single node","type":"extras"},{"doc":"Having multiple Virtual Nodes is a must. We're going to need a config file for each one, so let's change it, config.exs can be something like this: import Config config :riax , vnode : Riax.VNode.Impl import_config ( &quot; \#{ Mix . env ( ) } .exs&quot; ) Now, let's create 2 files, dev.exs (or add to it, if already exists) and dev2.exs under /config: # dev.exs import Config config :riax , vnode : Riax.VNode.Impl config :riak_core , node : &#39;dev@127.0.0.1&#39; , web_port : 8198 , handoff_port : 8199 , ring_state_dir : &#39;ring_data_dir_1&#39; , platform_data_dir : &#39;data_1&#39; , schema_dirs : [ &#39;deps/riax/priv/&#39; ] # dev2.exs import Config config :riak_core , node : &#39;dev2@127.0.0.1&#39; , web_port : 8398 , handoff_port : 8399 , ring_state_dir : &#39;ring_data_dir_2&#39; , platform_data_dir : &#39;data_2&#39; , schema_dirs : [ &#39;deps/riax/priv/&#39; ] Now, you can try them locally on 2 separate terminal sessions (tmux, multiple termilas, terminal tabs... whatever you like), first run: MIX_ENV = dev iex -- name dev @ 127.0 . 0.1 - S mix run Then, on the other session, run: MIX_ENV = dev2 iex -- name dev2 @ 127.0 . 0.1 - S mix run Try to join them, and handoff will start (handoff is the way on which partitions of the key-space are distributed between VNodes.) You could also create a makefile for ease of use: node1: MIX_ENV=dev iex --name dev@127.0.0.1 -S mix run node2: MIX_ENV=dev2 iex --name dev2@127.0.0.1 -S mix run Now, try calling Riax.join('dev2@127.0.0.1') from terminal 1. Riax.ring_status will change to something like this: iex ( dev @ 127.0 . 0.1 ) 7 &gt; Riax . ring_status === === === === === === === === === === === === Nodes === === === === === === === === === === === === Node a : 2 ( 3.1 % ) dev @ 127.0 . 0.1 Node b : 62 ( 96.9 % ) dev2 @ 127.0 . 0.1 === === === === === === === === === === === === Ring === === === === === === === === === === === === = babb | abbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | bbbb | Eventually (a minute, give or take) it should reach 50% on each node. That's the handoff working.","ref":"setup.html#multiple-nodes","title":"Setup - Multiple nodes","type":"extras"},{"doc":"Use Case I've mentioned this use case before, but let's go over it again: We have several, or one relatively big file that we want to provide (a dataset, for example) The file, or files, are not fit to be stored in memory due to its/their size. We want to avoid disk reading whenever we can, and achieve high availability. We can scale horizontally and divide said file. This is where Riak comes in.","ref":"tutorial.html","title":"Tutorial","type":"extras"},{"doc":"We're going to address this use case in this tutorial, with the help of Riak Core. The key thing here is that we can use several Riak Nodes to offer an in memory key-value storage. If we need more memory to store what we need, we can add another node to our cluster and Riak Core will handle the details for us, provided we have an implemented VNode. Creating a project Let's create a new mix project: mix new my_cluster for this, and make sure to follow the setup steps from above (if you don't have a config folder, just create it), and use the VNode I mention. Also, add this module under lib/riax_api.ex, which we'll use as an API to communicate with the VNode: defmodule Riax.API do def put ( key , value ) do Riax . sync_command ( key , { :put , { key , value } } ) end def put ( key , value , :no_log ) do Riax . sync_command ( key , { :put , :no_log , { key , value } } ) end def get ( key ) do Riax . sync_command ( key , { :get , key } ) end def keys ( ) do Riax . coverage_command ( :keys ) end def clear ( ) do Riax . coverage_command ( :clear ) end def values ( ) do Riax . coverage_command ( :values ) end def ring_status ( ) do { :ok , ring } = :riak_core_ring_manager . get_my_ring ( ) :riak_core_ring . pretty_print ( ring , [ :legend ] ) end def ping ( ) do ping ( :os . timestamp ( ) ) end def ping ( key ) do Riax . sync_command ( key , { :ping , key } ) end end Each function is to communicate with our VNode that acts as a key-value store, note this function: def handle_command ( { :put , :no_log , { k , v } } , _sender , state = %{ data : data } ) do new_data = Map . put ( data , k , v ) { :reply , :ok , %{ state | data : new_data } } end It's just to store a key-value pair, but it does not log it, as to make it faster. Also, note the keys/0 and values/0 . They're coverage commands, that means that they run in every node, each node returns a different answer. Limiting VM Memory To simulate a situation where our file is too big to be stored in RAM, we're going to use a tweet dataset of around 3-4 GiB, a CSV taken from Kaggle (you might need an account to download it, don't worry - it's free) and limit the available memory for our nodes. It's a collection of tweets about Bitcoin, we're only interested in its size not its content, so it's useful. Limiting available memory for a given BEAM instance it's quite easy, actually, we just need to use these arguments: +MMsco true +MMscs X +Musac false where X is an integer - the max accessible memory four our BEAM instance. You can read more about this here Let's try starting iex normally and read the zip file I've linked above. iex(1)&gt; { :ok , file } = File . read ( &quot;mbsa.csv.zip&quot; ) { :ok , &lt;&lt; 80 , 75 , 3 , 4 , 45 , 0 , 0 , 0 , 8 , 0 , 174 , 188 , 29 , 83 , 199 , 127 , 10 , 192 , 255 , 255 , 255 , 255 , 255 , 255 , 255 , 255 , 8 , 0 , 20 , 0 , 109 , 98 , 115 , 97 , 46 , 99 , 115 , 118 , 1 , 0 , 16 , 0 , 172 , 145 , 99 , 186 , 0 , 0 , ... &gt;&gt; } Now, let's start iex with a memory limit of 512 MB: iex --erl &quot;+MMsco true +MMscs 512 +Musac false&quot; iex(1)&gt; file = File . read! ( &quot;mbsa.csv.zip&quot; ) * * ( File.Error ) could not read file &quot;mbsa.csv.zip&quot; : not enough memory ( elixir 1.13 . 0 ) lib / file . ex : 355 : File . read! / 1 Working as intended: we tried to load a 1GB+ file while only having 512MB available. The unzipped CSV has a size of 8.5 GB, once stored in memory, so let's give each node 3GB of memory. This brings up an interesting result, since Riak scales horizontally easily, this kind of use case is a perfect fit for Riak: we can add more nodes to distribute the file easily. node1_limited: MIX_ENV=dev iex --erl &quot;+MMsco true +MMscs 3000&quot; --name dev@127.0.0.1 -S mix run node2_limited: MIX_ENV=dev2 iex --erl &quot;+MMsco true +MMscs 3000&quot; --name dev2@127.0.0.1 -S mix run node3_limited: MIX_ENV=dev3 iex --erl &quot;+MMsco true +MMscs 3000&quot; --name dev3@127.0.0.1 -S mix run You're going to need another config file: config/dev3.exs: import Config config :riak_core , node : &#39;dev3@127.0.0.1&#39; , web_port : 8498 , handoff_port : 8499 , ring_state_dir : &#39;ring_data_dir_3&#39; , platform_data_dir : &#39;data_3&#39; , schema_dirs : [ &#39;deps/riax/priv/&#39; ] Try running each node and joining them with Riax.join, like in the setup. Setting up csv Storing Let's use NimbleCsv (it's maintained by José Valim so it must be good) to read our file, add this to your dependencies in mix.exs { :nimble_csv , &quot;~&gt; 1.1&quot; } Let's add to the lib/my_cluster.ex the following functions: defmodule CSVSetup do alias NimbleCSV.RFC4180 , as : CSV def distribute_csv ( path ) do :rpc . multicall ( CSVSetup , :store_csv , [ path ] ) end def store_csv ( csv ) do curr_node = node ( ) csv |&gt; File . stream! ( read_ahead : 100_000 ) |&gt; CSV . parse_stream ( ) |&gt; Stream . with_index ( ) |&gt; Stream . each ( fn { [ date , text , sentiment ] , indx } -&gt; case Riax . preferred_node_name ( indx ) do ^ curr_node -&gt; # Date, text and sentiment are the 3 columns # that our example CSV of tweets has. Riax.API . put ( indx , %{ date : date , text : text , sentiment : sentiment } , :no_log ) _ -&gt; nil end end ) |&gt; Stream . run ( ) end end distribute_csv/1 receives a path to a csv file, and tells each running Riak Node (the ones joined using :riak_core.join/1) with the :rpc module (more about it here ) to execute the store_csv/1 function. store_csv/1 indexes every row of the CSV and uses them as keys for storing each row. So we end up with an index -&gt; row mapping. We only store the index row pair if the index key belongs to the running node partition. We use put/3 without logging because we know what we're storing. Reading CSV Now that we have everything in place, lets run 3 VNodes in separate terminals, using the make targets. On dev2 an dev3, run this Riax.ring_join(dev@127.0.0.1) . Keep in mind that each node will remember who it has joined, so you don't have to do this every time you start the nodes. Run Riax.ring_status and wait a minute, you'll see that the key-space is evenly distributed between the 3 nodes. Now, on any of the 3 nodes. Remember the csv we downloaded a few steps above? Get its path, and run the following iex&gt; path = &quot;/Path/to/mbsa.csv&quot; iex&gt; MyCluster . distribute_csv ( path ) Wait a bit, the terminal on which you ran the distribute_csv function will not probably answer any commands until it stops reading the CSV and then, you can try to get any row of the CSV with Riax.get(number). Like this: iex ( dev @ 127.0 . 0.1 ) 17 &gt; Riax.API . get ( 100 ) %{ date : &quot;2019-05-27&quot; , sentiment : &quot;Positive&quot; , text : &quot;Arkada?lar..Biz,bu milletin aklõ olan kesimine H?TAP ediyoruz. \\n \\n #DOLAR \\n #DolarTL \\n #bist \\n #bist100 \\n #usdtry \\n #USDTRY \\n #XU100 \\n #???????????????? 2012 \\n #doge #dogeusd \\n #btc #btcusd \\n YTD&quot; } Visualizing Results Now that we have the data, let's show it. Stop the nodes and add scribe to your deps: # mix.exs defp deps do [ { :riax , &quot;&gt;= 0.1.0&quot; , github : &quot;lambdaclass/elixir_riak_core&quot; , branch : &quot;main&quot; } , { :scribe , &quot;~&gt; 0.10&quot; } ] end On your MyCluster module, add this function: def print_data ( page ) do data = Enum . map ( ( page * 10 ) .. ( page * 10 + 10 ) , fn indx -&gt; # Get on which Virtual Node indx is stored node = Riax . preferred_node_name ( indx ) tweet = Riax.API . get ( indx ) Map . merge ( tweet , %{ node : node } ) end ) Scribe . print ( data ) end Set up the nodes again and read the CSV. Here we're printing the CSV rows on batches of 10 elements, try for example: MyCluster.print_data(10)","ref":"tutorial.html#solution","title":"Tutorial - Solution","type":"extras"}]