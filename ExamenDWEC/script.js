var num = 0;
var chosenOpt = '';

function escriuLog(toPrint) {
		console.log(toPrint);
		guardaAArray(toPrint);
}

function validPrint() {
	var toPrint = evalOpt();
	if (toPrint >= 0 || typeof toPrint == 'string')
		escriuLog(toPrint);
}

function evalOpt() {
	var textbox = document.getElementById('inputData');
	var data = textbox.value;
	var dataSplit =	data.split('-');
	var dataOpt = dataSplit[0];
	var dataVal1 = dataSplit[1];
	var dataVal2 = dataSplit[2];
	
	if (chosenOpt != dataOpt)
	{
		chosenOpt = dataOpt;
		num = 0;
	}
	
	switch (dataOpt)
	{
		case 'INC':
			if (dataVal1 != '')
			{
				num += parseInt(dataVal1);
				return num;
			}
			else
				return -1;
			break;
			
		case 'RND':
			if (dataVal1 < dataVal2)
			{
				// Random not generating correctly between val1 and val2 :\
				num = Math.floor((Math.random()*dataVal2)+dataVal1);
				return num;
			}
			else
				return -1;
			break;
			
		case 'ALT':
			if (dataVal1 != '')
			{
				num = 0;
				for (var i = 0; i < dataVal1; i++)
					num += parseFloat((Math.random()*dataVal1));
				return 'Generating Money: $' + num.toFixed(2);
			}
			else
				return -1;
			break;
			
		default:
			return -1;
			break;	
	}
}

setInterval('validPrint()', 1000);
