console.log('js')
$(document).ready(function(){
	console.log("ready")
	var gradGenEd = gradProgress(userData);
	updateProgress("gradBar", gradGenEd)
	updateProgress("genEdBar", gradGenEd)
});

function gradProgress(data){
	console.log(data)
	courses = data['acadData']['classes']
	$.getJSON('courses/'+courses.join('_'), function(courseData){
		var credSum = 0

		var nsmSum = 0
		var nsmDepts = []
		var sbsSum = 0
		var sbsDepts = []
		var haSum = 0
		var haDepts = []

		var courses = courseData['courses']
		for (var i = 0; i < courses.length; i++){
			credSum += parseFloat(courses[i]['credit'])

			var genEd = courses[i]['genEdArea']
			var genEdArea = genEd.substring(0,2)
			var genEdDept = genEd.slice(-4)
			if(genEdArea == 'HA' && haSum < 3) {
				if(deptCount(genEdDept, haDepts) < 2) {
					haSum += 1
					haDepts.push(genEdDept)
				}
			} else if(genEdArea == 'SB' && sbsSum < 3) {
				if(deptCount(genEdDept, sbsDepts) < 2) {
					sbsSum += 1
					sbsDepts.push(genEdDept)
				}
			} else if(genEdArea == 'NS' && nsmSum < 3) {
				if(deptCount(genEdDept, nsmDepts) < 2) {
					nsmSum += 1
					nsmDepts.push(genEdDept)
				}
			}
		}
		return [credSum, nsmSum, sbsSum, haSum]
	})
}
function deptCount(dept, array) {
	var count = 0
	for(e in array) {
		if(e == dept) count += 1
	}
	return count
}

function updateProgress(progressID, classesNumbers){
	console.log(classesNumbers)
	$("#"+progressID).find(".progress-bar-success").css("width", (classesNumbers[0]))
}