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
    todosContainer.innerHTML = todos.map(todo => `
      <div class="todo">
        <h2>${todo.title}</h2>
        <p>
          <a href="/todos/${todo.id}">Show this todo</a>
        </p>
      </div>
    `).join('')
  }
});
