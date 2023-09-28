def example_method
    puts "Start of the method"
    yield  # ブロックを実行
    puts "End of the method"
  end
  
  example_method do
    puts "Inside the block"
  end