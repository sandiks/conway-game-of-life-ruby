require_relative 'app/world'


N=5
def init_game
  ww = World.new(N,N)
  for x in 0..N-1
    for y in 0..N-1
      ww.cell_at(x,y).live! if rand(100)%2 ==0
    end
  end
  ww
end

def run
  ww = init_game
  
  loop do
    input = gets.chomp
    command, *params = input.split /\s/

    case command
    when /\Aset\z/i
      p "Received message: #{params}"
      msg = params.join(' ')
      x,y = msg.split(' ').map(&:to_i)
      ww.cell_at(x,y).toggle!
      data = ww.cells.map {|cc| (cc.live? ? 1:0) }
      p data

    when /\Aquit\z/i
      break
    else puts 'Invalid command'
    end
  end
end
run
