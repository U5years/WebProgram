import { Template } from 'meteor/templating';
import {Accounts} from 'meteor/accounts-base';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.main.onCreated(function mainOnCreated(){
  Meteor.subscribe('todos');
});

Template.main.helpers({
  title() {
    return 'QuickTodos';
  },
  todos() {
    const todos = Todos.find();
    return todos;
  }
});

Template.main.events({
  'submit .add-todo'(event) {
    event.preventDefault();

    const text = event.target.text.value;
    const time = event.target.time.value;

    // console.log(time);
    Meteor.call('todos.insert', text, time);

    event.target.text.value = '';
    event.target.time.value = '';
  }
});

Template.todo.events({
  'click .toggle-checked'(event){
    Meteor.call('todos.setChecked', this._id, !this.checked);
  },
  'click .delete'(event) {
    Meteor.call('todos.delete', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('todos.setPrivate', this._id, !this.private);
  }
});

Template.todo.helpers({
  isOwner(){
    return this.owner == Meteor.userId();
  }
});
