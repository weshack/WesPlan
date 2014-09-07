console.log('js')
$(document).ready(function(){
	console.log("ready")
	var gradGenEd = gradProgress(userData);
	var majorInfo = majorProgress(userData);
	console.log(majorInfo)
	console.log(gradGenEd)

	for (var i = 0; i < userData['majorData'].length; i++){
			majorCourses(userData['majorData'][i], '#major'+i+'courses')
	}
	loadCustomMajor()
	$('#major-select').change(function(){

		onCustomMajor(userData)
	})

	// customMajor('PHYS', userData)
});

function loadCustomMajor(){
	$.getJSON('majors', function(data){
		majors = data['majors']
		for (var i = 0; i < majors.length; i++){
			$('#major-select').append('<option>'+majors[i]+'</option>')

		}
	});
}

function onCustomMajor(data){
	majorName = $('#major-select option:selected').text()

	$.getJSON('custom_major/'+majorName, {acadData:JSON.stringify(data['acadData'])}, function(majorData){
		$('#custom_courses').children().children('li').remove();
		$('#custom_bar').children('h2').text(majorData['title'])
		majorCourses(majorData, '#custom_courses')

		taken = parseInt(majorData['reqsTaken'].length) + parseInt(majorData['t1Taken'].length) + parseInt(majorData['t2Taken'].length) + parseInt(majorData['t3Taken'].length)
		current = parseInt(majorData['reqsCurr'].length) + parseInt(majorData['t1Current'].length) + parseInt(majorData['t2Current'].length) + parseInt(majorData['t3Current'].length)
		reqs = parseInt(majorData['reqsTaken'].length) + parseInt(majorData['reqsCurr'].length) + + parseInt(majorData['reqsLeft'].length)
		electives = parseInt(majorData['t1Total']) + parseInt(majorData['t2Total']) + parseInt(majorData['t3Total'])
		total = reqs + electives
		updateProgress("custom_bar", taken, current, total)

	});

}

function majorProgress(data){
	var majors = data['acadData']['major'].split(',')
	for (var i = 0; i < majors.length; i++){
		taken = parseInt(data['majorData'][i]['reqsTaken'].length) + parseInt(data['majorData'][i]['t1Taken'].length) + parseInt(data['majorData'][i]['t2Taken'].length) + parseInt(data['majorData'][i]['t3Taken'].length)
		current = parseInt(data['majorData'][i]['reqsCurr'].length) + parseInt(data['majorData'][i]['t1Current'].length) + parseInt(data['majorData'][i]['t2Current'].length) + parseInt(data['majorData'][i]['t3Current'].length)
		reqs = parseInt(data['majorData'][i]['reqsTaken'].length) + parseInt(data['majorData'][i]['reqsCurr'].length) + + parseInt(data['majorData'][i]['reqsLeft'].length)
		electives = parseInt(data['majorData'][i]['t1Total']) + parseInt(data['majorData'][i]['t2Total']) + parseInt(data['majorData'][i]['t3Total'])
		total = reqs + electives
		updateProgress("major" + i + "bar", taken, current, total)
		// majors[i]
	}
}

function displayCourses(majorData, majorSelector, current, taken, core, coreTotal, electives){

	var courseStr = coreTotal.concat(taken.concat(current)).join('_')


	$.getJSON('courses/'+courseStr, function(courseData){
		courseData = courseData['courses']
		for (var j = 0; j < taken.length;  j++){
			 var courses = $.grep(courseData, function(e){return (e['department'] + e['number']) == taken[j];});
			 if (courses.length == 0){
			 	majorSelector.children('#taken').append('<li class="classTaken">' + taken[j]+ '</li>')
			 }
			 else{
			 	var course = courses[courses.length-1]
			 	var html = '<li class="classTaken"><a href='+course['url'] + '>' + taken[j]+ '</a></li>'
			 	majorSelector.children('#taken').append(html)
			 }
		}

		for (var j = 0; j < current.length;  j++){
			var courses = $.grep(courseData, function(e){return (e['department'] + e['number']) == current[j];});

			 if (courses.length == 0){
			 	majorSelector.children('#taken').append('<li class="classTaking">' + current[j]+ '</li>')
			 }
			 else{
			 	var course = courses[courses.length-1]
			 	var html = '<li class="classTaking"><a href='+course['url'] + '>' + current[j]+ '</a></li>'
			 	majorSelector.children('#taken').append(html)
			 }	
		}

		for (var j = 0; j < core.length;  j++){
			name = core[j]
			if (name.indexOf(" or ") > -1){
				n1 = name.substring(1,name.length-1).split(' or ')[0]
				n2 = name.substring(1,name.length-1).split(' or ')[1]



				var course1 = $.grep(courseData, function(e){return (e['department'] + e['number']) == n1;});
				var course2 = $.grep(courseData, function(e){return (e['department'] + e['number']) == n2;});

				if (course1.length == 0){
					html1 = n1
				} else{
					html1 = '<a href=' + course1[course1.length-1]['url'] + '>' + n1 + '</a>'
				}
				if (course2.length == 0){
					html2 = n2
				} else{
					html2 = '<a href=' + course2[course2.length-1]['url'] + '>' + n2 + '</a>'
				}
				majorSelector.children('#core').append('<li>' + html1 + " or " + html2 + '</li>')
				// majorSelector.children('#core').append('<li>' + n1+ '</li>')
				// majorSelector.children('#core').append('<li>' + n2+ '</li>')
			}
			else{
				var course =  $.grep(courseData, function(e){return (e['department'] + e['number']) == name;});
				
				if (course.length==0){
					html = name
				}else{
					html = '<a href=' + course[courses.length-1]['url'] + '>' + name + '</a>'
				}

				majorSelector.children('#core').append('<li>' + html+ '</li>')
			}
		}

		tier1CoursesLeft = majorData['t1Total'] - (majorData['t1Taken'].length + majorData['t1Current'].length)
		tier2CoursesLeft = majorData['t2Total'] - (majorData['t2Taken'].length + majorData['t2Current'].length)
		tier3CoursesLeft = majorData['t3Total'] - (majorData['t3Taken'].length + majorData['t3Current'].length)

		if (tier1CoursesLeft > 0){
			majorSelector.children('#elect').append('<li>' + tier1CoursesLeft+ ' courses '+ majorData['t1Strings']+'</li>')
		}
		if (tier2CoursesLeft > 0){
			majorSelector.children('#elect').append('<li>' + tier2CoursesLeft+ ' courses '+ majorData['t2Strings']+'</li>')
		}
		if (tier3CoursesLeft > 0){
			majorSelector.children('#elect').append('<li>' + tier3CoursesLeft+ ' courses '+ majorData['t3Strings']+'</li>')
		}
		if (tier1CoursesLeft == 0 && tier2CoursesLeft == 0 && tier3CoursesLeft == 0) {
			majorSelector.children('#elect').append('<li class="classTaken">No electives remaining!</li>')
		}

	})


	

}

function majorCourses(majorData, selector){
	majorSelector = $(selector)

	// var majorData = data['majorData'][i]
	//var majorSelector = $('#major'+majorNum+'courses')


	var current = majorData['reqsCurr']

	var taken = []
	taken = taken.concat(majorData['reqsTaken'])
	taken = taken.concat(majorData['t1Taken'])
	taken = taken.concat(majorData['t2Taken'])
	taken = taken.concat(majorData['t3Taken'])

	var core = majorData['reqsLeft']
	console.log(core)
	coreTotal = []
	for (var j = 0; j < core.length;j++){
		var name = core[j]
		if (name.indexOf(" or ")>01){
			n1 = name.substring(1,name.length-1).split(' or ')[0]
			n2 = name.substring(1,name.length-1).split(' or ')[1]
			coreTotal.push(n1)
			coreTotal.push(n2)
		}
		else{
			coreTotal.push(name)
		}
	}

	var electives = []
	electives = electives.concat(majorData['t1Strings'])
	electives = electives.concat(majorData['t2Strings'])
	electives = electives.concat(majorData['t3Strings'])

	displayCourses(majorData, majorSelector, current, taken, core, coreTotal, electives)
	// var courseStr = (electives.concat(coreTotal.concat(taken))).join('_')
	// console.log(courseStr)
	// console.log(majorData)
	// console.log(majorData)
		// console.log(courseData)

	
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
		else{credits += x['credit']}
	}
	console.log(credits + ', ' + creditsCurr)
	
	updateProgress("gradBar", credits, creditsCurr, 32)

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
	$("#"+progressID).children('div').children('p').text((takenCourses+takingCourses)+'/'+totalCourses)
	//$("#"+progressID).find("p:contains('0/0')").text((takenCourses+takingCourses)+'/'+totalCourses)
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





