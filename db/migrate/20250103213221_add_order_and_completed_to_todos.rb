class AddOrderAndCompletedToTodos < ActiveRecord::Migration[8.0]
  def change
    add_column :todos, :order, :integer, default: 0
    add_column :todos, :completed, :boolean, default: false
  end
end
