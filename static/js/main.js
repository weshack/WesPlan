console.log('js')
$(document).ready(function(){
	console.log("ready")
	var gradGenEd = gradProgress(userData);
	var majorInfo = majorProgress(userData);
	console.log(majorInfo)
	console.log(gradGenEd)
	
});

function majorProgress(data){
	var majors = data['acadData']['major'].split(',')
	for (var i = 0; i < majors.length; i++){
		updateProgress("major" + i + "bar", 5, 2, 10)
		// majors[i]
	}
}
function gradProgress(data){
	var courses = data['acadData']['classes']
	var credits = 0  //TOTAL credits
	var creditsCurr = 0
	var names = []
	console.log(courses)
	for (var i =0; i < courses.length;i++){
		x = courses[i]
		names.push(x['name'])
		if (x['current']){creditsCurr += parseFloat(x['credit'])}
		else {credits += parseFloat(x['credit'])}
	}
	updateProgress("gradBar", credits-creditsCurr, creditsCurr, 32)

	console.log(names)
	$.getJSON('courses/'+names.join('_'), function(courseData){
		console.log("HERE")
		var nsmSum = 0
		var nsmDepts = []
		var sbsSum = 0
		var sbsDepts = []
		var haSum = 0
		var haDepts = []

		var courseList = courseData['courses']
		for (var i = 0; i < courseList.length; i++){
			var genEd = courseList[i]['genEdArea']
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
		console.log([credits, nsmSum, sbsSum, haSum])
		updateProgress("genEdBar", nsmSum+sbsSum+haSum, 0, 9)
		updateGenEds(nsmSum, sbsSum, haSum)

		return [credits, nsmSum, sbsSum, haSum]
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
		console.log("#"+"nsm"+i.toString())
		$("#"+"nsm"+i.toString()).addClass("bg-success")
	}
	for(var i = 0; i < sbsSum; i++) {
		console.log("#"+"sbs"+i.toString())
		$("#"+"sbs"+i.toString()).addClass("bg-success")
	}
	for(var i = 0; i < haSum; i++) {
		console.log("#"+"ha"+i.toString())
		$("#"+"ha"+i.toString()).addClass("bg-success")
	}
}





