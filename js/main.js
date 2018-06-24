;
'use strict';
var Event = new Vue();

Vue.component('task', {
    template: '#task-tpl',
    props: ['todo'],
    methods: {
        action(name, params) {
            Event.$emit(name, params);
        }
    }
});

var vue = new Vue({
    el: '#main',
    data: {
        list: [],
        current: {},
        maxId: null,
        focusState: false
    },
    mounted() {
        let me = this;
        this.list = getStorage('todolist') || [];
        this.maxId = getStorage('maxid') || 1;
        setInterval(() => {
            this.checkDate();
        }, 10000);
        Event.$on('remove', function (id) {
            if (id)
                me.remove(id);
        });
        Event.$on('completed', function (id) {
            if (id)
                me.completed(id);
        });
        Event.$on('setTodo', function (todo) {
            if (todo)
                me.setTodo(todo);
        });
        Event.$on('detailToggle', function (id) {
            if (id)
                me.detailToggle(id);
        });
    },
    methods: {
        inputFocus() {
            this.focusState = true;
        },
        inputBlur() {
            this.focusState = false;
        },
        checkDate() {
            let me = this;
            this
                .list
                .forEach((item, index) => {
                    if (!item.date || item.confirmed)
                        return;
                    let time = new Date(item.date);
                    let recommandTime = time.getTime();
                    let currentTime = new Date();
                    if (recommandTime <= currentTime.getTime()) {
                        let bl = confirm(item.title + '任务已经过期限');
                        Vue.set(me.list[index], 'confirmed', bl);
                    }
                });
        },
        merge() {
            let id = this.current.id;
            if (id) {
                let index = this
                    .list
                    .findIndex(function (item) {
                        return item.id == id;
                    });
                Vue.set(this.list, index, Object.assign({}, this.current));
            } else {
                let title = this.current.title;
                if (!title && title !== 0)
                    return;
                let todoList = Object.assign({}, this.current);
                todoList.id = this.maxId++;
                todoList.completed = false;
                this
                    .list
                    .push(todoList);
            }
            this.resetInput();
            this.focusState = false;
        },
        remove(id) {
            let index = this
                .list
                .findIndex(function (item) {
                    return item.id == id;
                });
            this
                .list
                .splice(index, 1);
        },
        setTodo(todo) {
            this.current = Object.assign({}, todo);
        },
        resetInput() {
            this.setTodo({});
        },
        completed(id) {
            let index = this
                .list
                .findIndex(function (item) {
                    return item.id == id;
                });
            this.list[index].completed = !this.list[index].completed;
            let data = Object.assign({}, this.list[index])
            Vue.set(this.list, index, data);
        },
        detailToggle(id) {
            let index = this
                .list
                .findIndex(function (item) {
                    return item.id == id;
                });
            Vue.set(this.list[index], 'showDetail', !this.list[index].showDetail);
        },
        taskNotDoneChecked() {
            let count = 0;
            this
                .list
                .forEach(item => {
                    if (!item.completed)
                        count++;
                });
            return count;
        },
        taskDoneChecked() {
            let count = 0;
            this
                .list
                .forEach(item => {
                    if (item.completed)
                        count++;
                });
            return count;
        }
    },
    watch: {
        list: {
            deep: true,
            handler(newData, oldData) {
                if (newData) {
                    setStorage('todolist', newData);
                } else {
                    setStorage('todolist', oldData);
                }
            }
        },
        maxId: {
            handler(newId, oldId) {
                if (newId) {
                    setStorage('maxid', newId);
                } else {
                    setStorage('maxid', oldId);
                }
            }
        }
    }
});