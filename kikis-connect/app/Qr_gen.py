# code for image generation 


import segno

qr_try1 = segno.make_qr("hello kiki")

qr_try1.save(
	"hello-kiki.png",
	scale = 7,
	border = 1,
	)