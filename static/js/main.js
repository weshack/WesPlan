console.log('js')
$(document).ready(function(){
	console.log("ready")
	var gradGenEd = gradProgress(userData);
	var majorInfo = majorProgress(userData);
	console.log(majorInfo)
	console.log(gradGenEd)
	majorCourses(userData)
});

function majorProgress(data){
	var majors = data['acadData']['major'].split(',')
	for (var i = 0; i < majors.length; i++){
		taken = parseInt(data['majorData'][i]['reqsTaken'].length) + parseInt(data['majorData'][i]['t1Taken'].length) + parseInt(data['majorData'][i]['t2Taken'].length) + parseInt(data['majorData'][i]['t3Taken'].length)
		current = parseInt(data['majorData'][i]['reqsCurr'].length) + parseInt(data['majorData'][i]['t1Current'].length) + parseInt(data['majorData'][i]['t2Current'].length) + parseInt(data['majorData'][i]['t3Current'].length)
		reqs = parseInt(data['majorData'][i]['reqsTaken'].length) + parseInt(data['majorData'][i]['reqsCurr'].length) + + parseInt(data['majorData'][i]['reqsLeft'].length)
		electives = parseInt(data['majorData'][i]['t1Total']) + parseInt(data['majorData'][i]['t2Total']) + parseInt(data['majorData'][i]['t3Total'])
		total = reqs + electives
		console.log([reqs,electives,total])
		updateProgress("major" + i + "bar", taken, current, total)
		// majors[i]
	}
}

function majorCourses(data){
	console.log(data['majorData'])
	for (var i = 0; i < data['majorData'].length; i++){

		majorData = data['majorData'][i]
		majorSelector = $('#major'+i+'courses')


		current = majorData['reqsCurr']

		taken = []
		taken = taken.concat(majorData['reqsTaken'])
		taken = taken.concat(majorData['t1Taken'])
		taken = taken.concat(majorData['t2Taken'])
		taken = taken.concat(majorData['t3Taken'])

		for (var j = 0; j < current.length;  j++){
			majorSelector.children('#taken').append('<li style="color: blue">' + current[j]+ '</li>')	
		}

		for (var j = 0; j < taken.length;  j++){
			majorSelector.children('#taken').append('<li>' + taken[j]+ '</li>')	
		}

		core = majorData['reqsLeft']
		for (var j = 0; j < core.length;  j++){
			name = core[j]
			if (name.indexOf(" or ") > -1){
				n1 = name.substring(1,name.length-1).split(' or ')[0]
				n2 = name.substring(1,name.length-1).split(' or ')[1]
				majorSelector.children('#core').append('<li>' + n1+ '</li>')
				majorSelector.children('#core').append('<li>' + n2+ '</li>')
			}
			else{majorSelector.children('#core').append('<li>' + name+ '</li>')}	
		}

		electives = []
		electives = electives.concat(majorData['t1Strings'])
		electives = electives.concat(majorData['t2Strings'])
		electives = electives.concat(majorData['t3Strings'])

		console.log(electives)

		for (var j = 0; j < electives.length;  j++){
			majorSelector.children('#elect').append('<li>' + electives[j]+ '</li>')
		}
	}


	

}
function gradProgress(data){
	var courses = data['acadData']['classes']
	var credits = data['acadData']['preMatric']
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

	for(var i = 0; i < array.length; i++) {
		if(array[i] == dept) {
			count += 1
		}
	}
	console.log()
	return count
}

function updateProgress(progressID, takenCourses, takingCourses, totalCourses){
	console.log([progressID, takenCourses, takingCourses, totalCourses])
	takenPercent = takenCourses/totalCourses*100
	takingPercent = takingCourses/totalCourses*100
	toTakePercent = 100-(takenPercent+takingPercent)
	toTakeCourses = totalCourses - (takenCourses+takingCourses)
	$("#"+progressID).find(".progress-bar-success").css("width", takenPercent+'%')
	$("#"+progressID).find(".progress-bar-success").find("span").text(takenCourses+ " credits")
	$("#"+progressID).find(".progress-bar-warning").css("width", takingPercent+'%')
	$("#"+progressID).find(".progress-bar-warning").find("span").text(takingCourses+ " credits")
	$("#"+progressID).find(".progress-bar-emptySpace").css("width", toTakePercent+'%')
	$("#"+progressID).find(".progress-bar-emptySpace").find("span").text(toTakeCourses + " credits")
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





