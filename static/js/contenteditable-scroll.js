function scroll(amount)
{
	var current = $(document).scrollTop();
	var adjusted = current + amount;
	
	$(document).scrollTop(adjusted);
}

$(document).keydown(function(event)
{
	if(event.keyCode == 40) {
		scroll(32);
		event.preventDefault(); }
		
	else if(event.keyCode == 38) {
		scroll(-32);
		event.preventDefault(); }
		
	else if(event.keyCode == 34) {
		scroll(256);
		event.preventDefault(); }
		
	else if(event.keyCode == 33) {
		scroll(-256);
		event.preventDefault(); }	
});