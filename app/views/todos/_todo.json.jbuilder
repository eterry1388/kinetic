json.extract! todo, :id, :title, :order, :completed, :created_at, :updated_at
json.url todo_url(todo, format: :json)
