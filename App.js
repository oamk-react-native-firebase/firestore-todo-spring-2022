import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Button, Alert, TextInput } from 'react-native';
import { firebase, TODOS_COLLECTION } from './firebase/Config';
import { TodoItem } from './components/TodoItem';

export default function App() {

  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState({});

  useEffect(() => {
    firebase.firestore()
      .collection(TODOS_COLLECTION)
      .orderBy('todoItem')
      .onSnapshot(querySnapShot => {
        const data = querySnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      let todoItems = {...data};
      setTodos(todoItems);
    });
  }, []);

  function addNewTodo() {
    if (newTodo.trim() !== "") {
      firebase.firestore().collection(TODOS_COLLECTION).add({
        done: false,
        todoItem: newTodo
      })
      setNewTodo('');
    }
  }

  function removeTodos() {
    firebase.firestore()
      .collection(TODOS_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
      });
    });
  }

  const createTwoButtonAlert = () => Alert.alert(
    "Todolist", "Remove all items?", [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
    { 
      text: "OK", onPress: () => removeTodos()
    }],
    { cancelable: false }
  );

  let todosKeys = Object.keys(todos);

  return (
    <View 
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.header}>Todolist ({todosKeys.length})</Text>
      <View style={styles.newItem}>
        <TextInput
          placeholder='Add new todo'
          value={newTodo}
          style={styles.textInput}
          onChangeText={setNewTodo}
        />
      </View>
      <View style={styles.buttonStyle}>
        <Button 
          title="Add new Todo item"
          onPress={() => addNewTodo()}
        />
      </View>
      <ScrollView>
        {todosKeys.length > 0 ? (
          todosKeys.map(key => (
          <TodoItem
            key={key}
            id={todos[key]}
            todoItem={todos[key]}
          />
        ))
        ) : (
          <Text style={styles.infoText}>There are no items</Text>
        )}
        <View style={styles.buttonStyle}>
          <Button 
            title="Remove all todos" 
            onPress={() => createTwoButtonAlert()} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    marginLeft: 30,
    height: '20%',
  },
  contentContainerStyle: {
    alignItems: 'flex-start',
  },
  header: {
    fontSize: 30
  },
  newItem: {
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 15
  },
  buttonStyle: {
    marginTop: 10,
    marginBottom: 10,
    width: "80%"
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#afafaf',
    width: '80%',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginVertical: 20,
    fontSize: 18
  }
});