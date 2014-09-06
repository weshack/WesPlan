console.log('js')
$(document).ready(function(){
	console.log("ready")
	var gradGenEd = gradProgress(userData);
	console.log(gradGenEd)
	
});

function gradProgress(data){
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
		updateProgress("gradBar", credSum, 0, 32)
		updateProgress("genEdBar", nsmSum+sbsSum+haSum, 0, 9)
		updateGenEds(nsmSum, sbsSum, haSum)

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

function updateProgress(progressID, takenCourses, takingCourses, totalCourses){
	$("#"+progressID).find(".progress-bar-success").css("width", (takenCourses/totalCourses*100)+'%')
	$("#"+progressID).find(".progress-bar-warning").css("width", (takingCourses/totalCourses*100)+'%')
	$("#"+progressID).find("p").text((takenCourses+takingCourses)+'/'+totalCourses)
}


function updateGenEds(nsmSum, sbsSum, haSum) {
	for(var i = 0; i < nsmSum; i++) {
		$("#"+"nsm"+i.toString()).addClass("bg-success")
	}
	for(var i = 0; i < sbsSum; i++) {
		$("#"+"sbs"+i.toString()).addClass("bg-success")
	}
	for(var i = 0; i < haSum; i++) {
		$("#"+"ha"+i.toString()).addClass("bg-success")
	}
}





