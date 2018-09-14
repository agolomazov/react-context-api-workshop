import React, { Component, Fragment } from 'react';
import cuid from 'cuid';

const AppContext = React.createContext();

class AppProvider extends Component {
	state = {
		tasks: [
			{ id: 1, title: 'New React Context Api' },
			{ id: 2, title: 'Learn Vue JS' },
			{ id: 3, title: 'Master Node JS' },
		],
	};

	addTask = title => {
		if (!title.trim()) {
			return;
		}
		this.setState({
			tasks: [
				...this.state.tasks,
				{
					id: cuid(),
					title,
				},
			],
		});
	};

	deleteTask = idTask => {
		let { tasks } = this.state;
		tasks = tasks.filter(task => task.id !== idTask);
		this.setState({
			tasks,
		});
	};

	render() {
		return (
			<AppContext.Provider
				value={{
					state: this.state,
					onAddTask: title => this.addTask(title),
					onDeleteTask: idTask => this.deleteTask(idTask),
				}}
			>
				{this.props.children}
			</AppContext.Provider>
		);
	}
}

const TaskForm = () => {
	return (
		<AppContext.Consumer>
			{context => {
				return (
					<div>
						<input
							type="text"
							placeholder="what do you want to do today?"
							className="input-title"
							ref={input => (this.taskTitle = input)}
						/>
						<button
							className="button-add"
							type="submit"
							onClick={() => {
								context.onAddTask(this.taskTitle.value);
								this.taskTitle.value = '';
							}}
						>
							&#x271A;
						</button>
					</div>
				);
			}}
		</AppContext.Consumer>
	);
};

const TaskList = () => {
	const renderUI = context => {
		const {
			state: { tasks },
			onDeleteTask,
		} = context;
		return tasks.map(task => (
			<li key={task.id}>
				<span>{task.title}</span>
				<button className="todo-delete-button" onClick={() => onDeleteTask(task.id)}>
					x
				</button>
			</li>
		));
	};

	return (
		<AppContext.Consumer>
			{context => {
				return renderUI(context);
			}}
		</AppContext.Consumer>
	);
};

const TaskApp = () => (
	<Fragment>
		<TaskForm />
		<ul className="task-list">
			<TaskList />
		</ul>
	</Fragment>
);

class App extends Component {
	render() {
		return (
			<AppProvider>
				<div className="container">
					<h1>Task managment app</h1>
					<TaskApp />
				</div>
			</AppProvider>
		);
	}
}

export default App;
