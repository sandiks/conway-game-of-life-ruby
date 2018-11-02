
require 'websocket-eventmachine-client'


def send_msg(data)

  EM.run do

    ws = WebSocket::EventMachine::Client.connect(:uri => 'ws://localhost:8080')

    ws.onopen do
      puts "Connected"
    end

    ws.onmessage do |msg, type|
      puts "Received message: #{msg}"
    end

    ws.onclose do |code, reason|
      puts "Disconnected with status code: #{code}"
    end

    EventMachine.next_tick do
      #data =  "#{x} #{y}"
      p data
      ws.send "#{data}"
    end

  end

end


def run
  loop do
    input = gets.chomp
    command, *params = input.split /\s/

    case command
    when /\Aset\z/i
      msg = params.join(' ')
      send_msg(msg)
    when /\Aquit\z/i
      break
    else puts 'Invalid command'
    end
  end
end
run