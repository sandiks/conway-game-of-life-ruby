require "websocket-eventmachine-server"
require_relative 'app/world'

N=20
def init_game
  ww = World.new(N,N)
  for x in 0..N-1
    for y in 0..N-1
      ww.cell_at(x,y).live! if rand(100)%2 ==0
    end
  end
  ww
end

def start_game
  ww = init_game

  Thread.new do
    round =0
    while true
      sleep 1
      round+=1
      p "---new round #{round}"
      ww.next_generation!
    end
  end

  EM.run do

    WebSocket::EventMachine::Server.start(:host => "localhost", :port => 8080) do |ws|
      ws.onopen do
        puts "Client connected"
      end

      ws.onmessage do |msg, type|
        p "Received message: #{msg}"
        unless msg.empty?
          x,y = msg.split(' ').map(&:to_i)
          ww.cell_at(x,y).toggle!
        end
        data = ww.cells.map {|cc| (cc.live? ? 1:0) }
        ws.send "#{data}", :type => type
      end

      ws.onclose do
        puts "Client disconnected"
      end
    end

  end
end

start_game
