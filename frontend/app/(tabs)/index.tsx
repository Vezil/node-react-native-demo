import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, SectionList, Button } from 'react-native';
import axios from 'axios';

interface Todo {
    id: number;
    text: string;
    isDone: boolean;
}

export default function App() {
    const [userTodo, setUserTodo] = useState<Todo>({
        id: 0,
        text: '',
        isDone: false
    });

    const [allTodos, setTodos] = useState<{ title: string; data: Todo[] }[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get<Todo[]>('http://localhost:3000/get-todos');

            const todos = response.data;

            const sections = [
                {
                    title: 'Todos',
                    data: todos.filter(todo => !todo.isDone) // incomplete todos
                },
                {
                    title: 'Completed',
                    data: todos.filter(todo => todo.isDone) // completed todos
                }
            ];

            setTodos(sections);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onConfirm = async () => {
        await axios.post('http://localhost:3000/add-todo', { text: userTodo.text });

        fetchData();
    };

    const ToDoList = ({ allTodos }) => {
        if (!allTodos.length) {
            return <Text>No todos available</Text>;
        }

        return (
            <SafeAreaView style={styles.safeAreaViewContainer}>
                <SectionList
                    sections={allTodos}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item.text}</Text>
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
                />
            </SafeAreaView>
        );
    };

    return (
        <View style={styles.container}>
            <ToDoList allTodos={allTodos} />
            <TextInput
                value={userTodo.text}
                onChangeText={text => setUserTodo({ ...userTodo, text })}
                style={styles.addTodoInput}
            />

            <Button onPress={onConfirm} title="Add Todo" color="#841584" accessibilityLabel="Add your new Todo" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    safeAreaViewContainer: {
        backgroundColor: '#eee'
    },
    title: {
        fontSize: 24
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff'
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8
    },
    addTodoInput: {
        backgroundColor: '#ccc',
        padding: 10,
        marginBottom: 4
    }
});
