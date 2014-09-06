console.log('js')
$(document).ready(function(){
	console.log("ready")
	gradProgress(userData)
});

function testf(data) {
	console.log(data)
}

function gradProgress(data){
	courses = data['acadData']['classes']
	$.getJSON('courses/'+courses.join('_'), function(courseData){
		credSum = 0
		courses = courseData['courses']
		for (var i = 0; i < courses.length; i++){
			credSum += parseFloat(courses[i]['credit'])
		}
		return credSum
	})
}