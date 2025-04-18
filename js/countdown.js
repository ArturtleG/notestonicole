function counter(box, date){
	box = "#" + box;
	
	var secondsTBox = $("[secondsT]", box);
	var secondsOBox = $("[secondsO]", box);
	var sPlural = $("[secondsLabel] .plural", box);
	
	var minutesTBox = $("[minutesT]", box);
	var minutesOBox = $("[minutesO]", box);
	var mPlural = $("[minutesLabel] .plural", box);
	
	var hoursTBox = $("[hoursT]", box);
	var hoursOBox = $("[hoursO]", box);
	var hPlural = $("[hoursLabel] .plural", box);
	
	var daysBox = $("[days]", box);
	var dPlural = $("[daysLabel] .plural", box);
		
	var startDate = new Date();
	var diff = date - startDate;
	var daysTil = 0;
	
	var hoursTil = 0;
	var hoursTTil = 0;
	var hoursOTil = 0;
	
	var minutesTil = 0;
	var minutesTTil = 0;
	var minutesOTil = 0;
	
	var secondsTil = 0;
	var secondsTTil = 0;
	var secondsOTil = 0;

	if(diff>0){
		var millsSecond = 1000;
		var millsMinute = millsSecond * 60;
		var millsHour = millsMinute * 60;
		var millsDay = millsHour * 24;
	
		daysTil = parseInt(diff/(millsDay));
		diff -= daysTil*millsDay;
		hoursTil = parseInt(diff/millsHour);
		diff -= hoursTil*millsHour;
		minutesTil = parseInt(diff/millsMinute);
		diff -= minutesTil*millsMinute;
		secondsTil = parseInt(diff/millsSecond);

		var sPluralChar = secondsTil == 1?"":"s";
		var mPluralChar = minutesTil == 1?"":"s";
		
		var hPluralChar = hoursTil == 1?"":"s";
		var dPluralChar = daysTil == 1?"":"s";
		
		//sPlural.text(sPluralChar);
		//mPlural.text(mPluralChar);
		//hPlural.text(hPluralChar);
		//dPlural.text(dPluralChar);

		secondsTTil = parseInt(secondsTil/10);
		secondsOTil = secondsTil%10;

		minutesTTil = parseInt(minutesTil/10);
		minutesOTil = minutesTil%10;

		hoursTTil = parseInt(hoursTil/10);
		hoursOTil = hoursTil%10;
	}

	secondsOBox.text(secondsOTil)
	secondsTBox.text(secondsTTil)
	minutesOBox.text(minutesOTil);
	minutesTBox.text(minutesTTil);
	hoursOBox.text(hoursOTil);
	hoursTBox.text(hoursTTil);
	daysBox.text(daysTil);
}

function addCounter(countersWrapper, id, title, date){
    console.log("adding:", id, title, date);
	var counterStr = 
		`<div id="${id}" class="clockWrapper">
			<div class="digitsWrapper">
			    <div class="digits">
			        <div class='digit' days>0</div>
			    </div>
				<div class='digits'>
					<div class='digit' hoursT>0</div>
					<div class='digit' hoursO>0</div>
				</div>
				<div class='digits'>
					<div class='digit' minutesT>0</div>
					<div class='digit' minutesO>0</div>
				</div>
				<div class='digits'>
					<div class='digit' secondsT>0</div>
					<div class='digit' secondsO>0</div>
				</div>
				<div class='label' daysLabel>D<span class='plural'></span></div>
				<div class='label' hoursLabel>H<span class='plural'></span></div>
				<div class='label' minutesLabel>M<span class='plural'></span></div>
				<div class='label' secondsLabel>S<span class='plural'></span></div>
			</div>
			<div id="cake"></div>
		</div>`;
	$(countersWrapper).append(counterStr);
	counter(id, date);
	setInterval(
		function(){
			counter(id, date);
		}, 1000);

}


//var countersWrapper = $("#countersWrapper");

var bDate = new Date("2025-05-04T00:00:00-05:00");

//addCounter("bday", "BEST day of the YEAR in", bDate);