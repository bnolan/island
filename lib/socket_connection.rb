require 'json'
require 'ostruct'


class Vector
  
  attr_accessor :x, :y, :z
  
  def initialize
    @x = 0
    @y = 0    
    @z = 0
  end
  
  # def to_s
  #   "<#{@x},#{@y}>"
  # end  
  
  def to_json
    [@x, @y, @z]
  end
  
end

class Player
  attr_accessor :id, :position, :velocity
  
  def initialize
    @id = (rand * 0xFFFF).to_i
    @position = Vector.new
    @velocity = Vector.new
  end
  
  def get_attributes
    {
      :id => @id,
      :position => @position.to_json,
      :velocity => @velocity.to_json
    }
  end
  
end
  
class SocketConnection

	def initialize(socket, channel)
		@socket = socket

		@player = Player.new # OpenStruct.new({ :id => (rand * 0xFFFF).to_i })
		@last_update = 0;
		@quota = 10;
									  		  		  
    port, ip = Socket.unpack_sockaddr_in(socket.get_peername)            
    Syslog.info "Connection ##{@player.id} from: #{ip}:#{port}"
    puts "Connection ##{@player.id} from: #{ip}:#{port}"
  	# @storage.connected(ip)    
  	@socket.send(%({"type":"welcome","id":#{@player.id}}))
  	subscribe(channel)
	end
	
	def subscribe(channel)
		@channel = channel
		@id = channel.subscribe {|message| @socket.send(message) }
		@socket.onmessage {|message| process_message(message) }
		@socket.onclose { unsubscribe }
	end
		
	def unsubscribe()
	  # @storage.disconnected()
	  broadcast %({"type":"closed","id":#{@player.id}})
	  Syslog.info "Disconnect ##{@player.id }"
		@channel.unsubscribe(@id)
	end
		
	def broadcast(message)
		@channel << message
	end
	
	def detect_spam
	  now = Time.now.to_f
	  @quota -= 1 if now-@last_update < 0.3
    @last_update = now
    @socket.close_connection(true) if @quota < 0	 
	end
	
	def process_message(data)	  	  	  
	  json = JSON.parse(data) rescue {};

    case json["type"]
    when "update"
      update_handler(json)
    when "message"  
      detect_spam()
      message_handler(json)
    when "authorize"
      authorize_handler(json)
    end    
  end

  def update_handler(json)
    @player.position.x    = json["position"][0].to_f rescue 0
    @player.position.y    = json["position"][1].to_f - 100 rescue 0
    @player.position.z    = json["position"][2].to_f rescue 0
    # @player.angle    = json["angle"].to_f rescue 0
    # @player.momentum = json["momentum"].to_f rescue 0    
    
    # name = json["name"]
    # name = nil if name && name.include?("@")    
    # @player.handle   = (@player.authorized || name || "Guest #{@player.id}").to_s[0...70]
    
    packet = @player.get_attributes
    packet[:type] = 'update'
    
    broadcast packet.to_json
  end

  def message_handler(json)
    msg = json["message"].to_s[0...70]
    
    @storage.message(msg,@player)
    
	  broadcast( %({"type":"message","id":#{@player.id},"message":#{ msg.to_json }}) )
  end
  
  # def authorize_handler(json)
  #   return if @authorization_lock 
  #   @authorization_lock = true;
  #   if json["token"]
  #     EM::Twitter.verifyRequest(json["token"],json["verifier"]) { |auth|
  #       if auth && auth.authorized?
  #         @player.authorized = "@#{auth.screen_name}"
  #         @storage.authorized(auth.user_id,auth.screen_name)
  #         Syslog.info("Authenticated ##{@player.id } as #{@player.authorized}")
  #         
  #         @player.handle = @player.authorized
  #         broadcast @player.to_json          
  #       else          
  #         @authorization_lock = nil
  #       end
  #     }
  #   else
  #     EM::Twitter.getRequest { |auth| 
  #       @socket.send(%({"type":"redirect","url":#{ auth.authorize_url.to_json }})) 
  #       @authorization_lock = nil
  #     }      
  #   end
  #   
  # end
  
end