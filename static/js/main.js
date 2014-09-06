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
		nsmSum = 0
		sbsSum = 0
		haSum = 0

		courses = courseData['courses']
		for (var i = 0; i < courses.length; i++){
			credSum += parseFloat(courses[i]['credit'])

			genEdArea = courses[i]['genEdArea'].substring(0,2)
			if(genEdArea == 'HA' && haSum < 3) {
				haSum += 1
			} else if(genEdArea == 'SB' && sbsSum < 3) {
				sbsSum += 1
			} else if(genEdArea == 'NS' && nsmSum < 3) {
				nsmSum += 1
			}
		}
		return [credSum, nsmSum, sbsSum, haSum]
	})
}
