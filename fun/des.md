### fun directory

这里是对ejs模板中主要方法做一个剥离，一个文件即一个功能



#### 变量渗入   

Render call:

>ejs.render(str, {
    users: [
      { name: 'tj' },
      { name: 'mape' },
      { name: 'guillermo' }
    ]
});

Template:

><p><%=: users | map:'name' | join %></p>

Output:

><p>Tj, Mape, Guillermo</p>

这里主要实现数据按照约定的方式来渗透到模板。

