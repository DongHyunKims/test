// (function(){
// 	var data = {name : "동현"};
// 	document.querySelector("button").addEventListener("click",function(){
//       	data.name = "상우";
//       	alert(data.name);
// 	});
// }())


function outFunc(str) {
   function innerFunc(string) {
       console.log(string)
   }
   innerFunc(str)
}
outFunc("Hello world");
