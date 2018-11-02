class Cell
  attr_reader :world, :x, :y
  def initialize(world, x, y)
    @world, @x, @y = world, x, y
    @live = false
  end

  def dead?
    !@live
  end

  def dead!
    @live = false
  end

  def live?
    @live
  end

  def live!
    @live = true
  end

  def toggle!
    @live = !@live
  end

  def neighbours
    neighbours = []
    offsets = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]]

    offsets.each do |dd|
      neighbours.push(@world.cell_at(self.x + dd[0], self.y + dd[1]))
    end
    neighbours
  end

  def live_neighbours
    self.neighbours.select do |n|
        n && n.live?
    end
  end
end
