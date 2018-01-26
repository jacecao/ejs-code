# ejs-code

>正在阅读中............................

探秘ejs模板（read code about ejs-module）   

一直以来好奇模板究竟是如何化腐朽为神奇的呢？从PHP开发中就不难看出后端页面的渲染将是所有后端开发必将面临的一个问题，在Node.JS中我们也要面对这样的问题，所以模板插件就成了后端开发必备。

>为什么挑选ejs模板作为探秘对象呢？首先个人比较喜欢ejs这样的模板风格（基本与HTML一样嘛），其次个人感觉其源码相对来说相对容易解析。

>究竟如何探秘ejs模板呢？我的初衷是希望了解模板的工作原理，然后解析代码设计的巧妙之处。
我希望能够尽力对源码的每个功能做一个注释，嗯，基本想法就是这样的。

* ### 小心坑

1. NodeJS中readFileSync方法。

一般我们比较常用的是利用其返回的缓存该文件内容的二进制对象，然后直接将该二进制对象传给下一个需要处理的模块中，而这里我们则需要直接获取到是文件内容（以字符串形式），所以我们做处理。这里有2种处理方式：     
> （1）fs.readFileSync(filename).toString();  
> 通过buffer对象的toString()放法将二进制对象转化为字符串    
> （2）fs.readFileSync(filename, 'utf8');
> 通过配置文件，直接将二进制对象按指定编码格式返回字符串，这个模块文件里就是使用此方式

2. JSON.stringify()方法需要注意的

如果我们将包含一些特殊符号的字符串通过JSON.stringify()方法转换后，虽然在控制台打印出来的效果是一样的，但其实本质是不一样的，JSON.stringify()会将特殊符号进行转义，一旦转义后，我们使用indeOf()方法就可能出现问题。      
> ```
> let str = 'hello
> world';
> ```     
> 原始字符串`str.indexOf('\n')`与`JSON.stringify(str).index('\n')`这里得到的数据是不一样的，这个在ejs的parse函数中特别重要，如果弄不清当前传入的字符串本质那么最终得到的JS字符串就有很大的差别。
> *此刻容易犯一个糊涂，当我们寻找字符串里的换行符时，最终得到的却是空白，这一度让我怀疑这是怎么回事呢？难道无法获取换行符，哈哈，其实如果没有JSON.stringify()来转换字符串那么我们获取字符串内换行符,只能得到一个空白，因为换行符在实际显示中确实是空白不可见的*