For run in environment of client side without server backup support, and user template technology so that we can include
head.html and tail.html in other page, we use two ways to solve this problem.
1. include head.js and tail.js, the contents of head.html and tail.html will be load in the way of ajax query, 
	so it must run in a server environment, not just as static files.
	for example, we put the head.js file in path js/, all pages will include this single file, 
	but template files should be changed if there are more page folders than one, because the template file reference other resources.
	so different pages folder have different template files. Of course, they as only different in the url of reference resource.
    root
	js/head.js, tail.html
	css/
	bin/
	index.html, head.html, tail.html	

	bin/head.html, tail.html, others.html


2. use iframe	