import { Meteor } from 'meteor/meteor';

Meteor.publish('todos', function todoPublication(){
  return Todos.find({
    $or: [
      {private: {$ne: true}},
      {owner: this.userId}
    ]
  });
});

Meteor.methods({
  // code to run on server at startup
  'todos.insert'(text, time) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Todos.insert({
      text,
      time,
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

    'todos.setChecked'(id, setChecked) {
      Todos.update(id, {$set:{checked: setChecked}});
    },

    'todos.delete'(id) {
      // if (todo.owner !== this.userId) {
      //   throw new Meteor.Error('Unauthorized');
      // }
      Todos.remove(id);
    },
    'todos.setPrivate'(id, setToPrivate){
      const todo = Todos.findOne(id);

      if (todo.owner !== this.userId) {
        throw new Meteor.Error('Unauthorized');
      }

      Todos.update(id, {$set:{private: setToPrivate}});
    }
});
