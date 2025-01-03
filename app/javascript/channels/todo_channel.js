import consumer from "channels/consumer"

consumer.subscriptions.create("TodoChannel", {
  connected() {
    console.log("connected")
  },

  disconnected() {
    console.log("disconnected")
  },

  received(data) {
    const todosContainer = document.getElementById("todos")
    const todos = JSON.parse(data.todos);

    todos.sort((a, b) => a.completed - b.completed || a.order - b.order);
    todosContainer.innerHTML = todos.map(todo => `
      <div class="todo" style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 5px; background-color: #f9f9f9;">
        <h2 style="margin: 0 0 10px; color: #333;">${todo.title} [${todo.order}]</h2>
        <p style="margin: 5px 0; color: ${todo.completed ? 'green' : 'red'};">${todo.completed ? 'Completed!' : ''}</p>
        <p style="margin: 10px 0 0;">
          <a href="/todos/${todo.id}" style="color: #007bff; text-decoration: none;">Show this todo</a>
        </p>
      </div>
    `).join('')
  }
});
