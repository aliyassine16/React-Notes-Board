"use strict";

var Board = React.createClass({
	displayName: "Board",


	propTypes: {
		count: function count(props, propName) {
			if (typeOf(props[propName]) !== "number") {
				return new Error("that should be a number!");
			}

			if (props[propName] > 100) {
				return new Error("creating more than " + props[propName] + " is just ridiculous mate !");
			}
		}
	},
	getInitialState: function getInitialState() {
		return {
			notes: []
		};
	},
	nextId: function nextId() {
		this.uniqueId = this.uniqueId || 0;
		return this.uniqueId++;
	},
	componentWillMount: function componentWillMount() {
		var self = this;
		if (this.props.count) {
			var url = "http://baconipsum.com/api/?type=all-meat&sentences=" + this.props.count + "&start-with-lorem=1&callback=?";

			$.getJSON(url, function (data) {
				data[0].split('. ').forEach(function (sentence) {
					self.add(sentence.substring(0, 40));
				});
			});
		}
	},
	add: function add(text) {
		var arr = this.state.notes;
		arr.push({
			id: this.nextId(),
			note: text
		});
		this.setState({ notes: arr });
	},
	update: function update(newText, i) {
		var arr = this.state.notes;
		arr[i].note = newText;
		this.setState({ notes: arr });
	},
	remove: function remove(i) {
		var arr = this.state.notes;
		arr.splice(i, 1);
		this.setState({ notes: arr });
	},

	eachNote: function eachNote(note, i) {
		return React.createElement(
			Note,
			{ key: note.id,
				index: i,
				onChange: this.update,
				onRemove: this.remove
			},
			note.note
		);
	},

	render: function render() {
		return React.createElement(
			"div",
			{ className: "board" },
			this.state.notes.map(this.eachNote),
			React.createElement("button", { className: "btn btn-sm btn-info glyphicon glyphicon-plus", onClick: this.add.bind(null, "New Note") })
		);
	}
});

var Note = React.createClass({
	displayName: "Note",

	getInitialState: function getInitialState() {
		return {
			editing: false
		};
	},
	randomBetween: function randomBetween(min, max) {
		return min + Math.ceil(Math.random() * max);
	},
	componentWillMount: function componentWillMount() {
		this.style = {
			right: this.randomBetween(0, window.innerWidth - 160) + 'px',
			top: this.randomBetween(0, window.innerHeight - 160) + 'px',
			transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'

		};
	},

	componentDidMount: function componentDidMount() {
		$(this.getDOMNode()).draggable();
	},

	edit: function edit() {
		this.setState({ editing: true });
	},
	remove: function remove() {
		this.props.onRemove(this.props.index);
	},
	save: function save() {
		var val = this.refs.newText.getDOMNode().value;
		this.props.onChange(val, this.props.index);
		this.setState({ editing: false });
	},
	renderForm: function renderForm() {
		return React.createElement(
			"div",
			{ className: "note", style: this.style },
			React.createElement(
				"p",
				null,
				React.createElement("textarea", { ref: "newText", defaultValue: this.props.children, className: "form-control" })
			),
			React.createElement(
				"span",
				null,
				React.createElement("button", { onClick: this.save, className: "btn btn-sm btn-success glyphicon glyphicon-floppy-disk" })
			)
		);
	},
	renderDisplay: function renderDisplay() {
		return React.createElement(
			"div",
			{ className: "note", style: this.style },
			React.createElement(
				"p",
				null,
				this.props.children
			),
			React.createElement(
				"span",
				null,
				React.createElement("button", { onClick: this.edit, className: "btn btn-sm btn-primary glyphicon glyphicon-pencil" })
			),
			React.createElement(
				"span",
				null,
				React.createElement("button", { onClick: this.remove, className: "btn btn-sm btn-danger glyphicon glyphicon-remove" })
			)
		);
	},

	render: function render() {
		if (this.state.editing) {
			return this.renderForm();
		} else {
			return this.renderDisplay();
		}
	}
});

React.render(React.createElement(Board, { count: 20 }), document.body);