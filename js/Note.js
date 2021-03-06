


var Board=React.createClass({

	propTypes:{
		count:function(props,propName){
			if(typeOf (props[propName])!=="number"){
				return new Error("that should be a number!");
			}
			
			if(props[propName]>100){
				return new Error("creating more than "+props[propName]+" is just ridiculous mate !");
			}

		}
	},
	getInitialState:function(){
		return {
			notes:[]
		};

	},
	nextId:function(){
		this.uniqueId= this.uniqueId || 0;
		return this.uniqueId++;
	},
	componentWillMount:function(){
		var self=this;
		if(this.props.count){
			var url="http://baconipsum.com/api/?type=all-meat&sentences="+this.props.count+"&start-with-lorem=1&callback=?";

			$.getJSON(url,function(data){
				data[0].split('. ').forEach((sentence)=>{
					self.add(sentence.substring(0,40));

				});

			});
		}

	},
	add:function(text){
		var arr=this.state.notes;
		arr.push({
			id:this.nextId(),
			note:text
		});
		this.setState({notes:arr});
	},
	update:function(newText,i){
		var arr=this.state.notes;
		arr[i].note=newText;
		this.setState({notes:arr});

	},
	remove:function(i){
		var arr=this.state.notes;
		arr.splice(i,1);
		this.setState({notes:arr});
	},

	eachNote:function(note,i){
		return(
			<Note key={note.id} 
			index={i}
			onChange={this.update}
			onRemove={this.remove}
			>{note.note}</Note>
			);
	},

	render:function(){
		return(

			<div className="board">
			{this.state.notes.map(this.eachNote)}
			<button className="btn btn-sm btn-info glyphicon glyphicon-plus" onClick={this.add.bind(null,"New Note")}></button>
			</div>

			);
	}
});




var Note =React.createClass({
	getInitialState:function(){
		return{
			editing:false
		};

	},
	randomBetween:function(min,max){
		return(min+Math.ceil(Math.random()*max));

	},
	componentWillMount:function(){
		this.style={
			right:this.randomBetween(0,window.innerWidth-160) +'px',
			top:this.randomBetween(0,window.innerHeight-160) +'px',
			transform:'rotate('+this.randomBetween(-15,15)+'deg)'

		}
	},

	componentDidMount:function(){
		$(this.getDOMNode()).draggable();
	},
	
	edit:function(){
		this.setState({editing:true});

	},
	remove:function(){
		this.props.onRemove(this.props.index);		

	},
	save:function(){
		var val=this.refs.newText.getDOMNode().value;
		this.props.onChange(val,this.props.index);
		this.setState({editing:false});
	},
	renderForm(){
		return (
			<div className="note" style={this.style}>
			<p><textarea ref="newText" defaultValue={this.props.children} className="form-control"></textarea></p>
			<span><button onClick={this.save} className="btn btn-sm btn-success glyphicon glyphicon-floppy-disk"></button></span>
			</div>
			);

	},
	renderDisplay(){
		return (

			<div className="note" style={this.style}>
			<p>{this.props.children}</p>
			<span><button onClick={this.edit} className="btn btn-sm btn-primary glyphicon glyphicon-pencil"></button></span>
			<span><button onClick={this.remove} className="btn btn-sm btn-danger glyphicon glyphicon-remove"></button></span>
			</div>

			);

	},
	render:function(){
		if(this.state.editing){
			return this.renderForm();
		}else{
			return this.renderDisplay();
		}

	}
});


React.render(<Board count={20} />,document.body);