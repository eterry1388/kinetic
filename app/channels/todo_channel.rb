class TodoChannel < ApplicationCable::Channel
  def subscribed
    puts "subscribed"
    stream_from "todo_channel"
  end

  def unsubscribed
    puts "unsubscribed"
  end

  def receive(data)
    puts "received", data
  end
end
