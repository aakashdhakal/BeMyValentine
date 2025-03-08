let preloader = document.querySelector(".preloader");
let dialog = document.querySelector("#invitation");

window.addEventListener("load", () => {
	setTimeout(() => {
		preloader.animate([{ opacity: 1 }, { opacity: 0, display: "none" }], {
			duration: 1000,
			fill: "forwards",
		});
	}, 1000);
	let params = new URLSearchParams(window.location.search);
	setTimeout(
		() => {
			if (Array.from(params).length > 0) {
				openDialog();
			}
		},

		2000
	);

	// Parse the query string
});

let form = document.querySelector(".valentine-form");
let submitBtn = document.querySelector(".valentine-form button");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	submitBtn.innerHTML =
		"<i class='fas fa-spinner fa-spin'></i> Creating Link...";
	let name = document.querySelector("#name").value;
	let crush = document.querySelector("#valentineName").value;
	let email = document.querySelector("#email").value;

	if (name === "" || email === "") {
		launch_toast("Please fill in all fields");
		submitBtn.innerHTML = "Create Link";
		return;
	} else if (crush === "") {
		launch_toast("Sem bro Sem - Developer");
		submitBtn.innerHTML = "Create Link";
		return;
	} else {
		let params = new URLSearchParams({ name, crush, email });
		let url = window.location.href + "?" + params.toString();

		shortenURL(url);
	}
});

function shortenURL(longUrl) {
	fetch(" https://api.short.io/links/public", {
		method: "POST",
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			authorization: "pk_kBPueHv2S9sjtGpU",
		},
		body: JSON.stringify({
			originalURL: longUrl,
			domain: "g1ri.short.gy",
		}),
	}).then((response) => {
		response.json().then((data) => {
			let linkArea = document.querySelector(".link-area a");
			linkArea.textContent = data.shortURL;
			linkArea.href = data.shortURL;
			launch_toast("Link created successfully");
			submitBtn.innerHTML = "Create Link";
		});
	});
}

function launch_toast(message) {
	var x = document.getElementById("toast");
	let descMessage = document.querySelector("#desc");
	descMessage.textContent = message;

	x.className = "show";
	setTimeout(function () {
		x.className = x.className.replace("show", "");
	}, 5000);
}

let copyToClipboard = document.querySelector(".link-area button");

copyToClipboard.addEventListener("click", async () => {
	let linkArea = document.querySelector(".link-area a");
	let linkText = linkArea.textContent;
	if (linkText === "Please share this link to your valentine" || linkText === "") {
		launch_toast("Please create a link first");
		return;
	}
	try {
		await navigator.clipboard.writeText(linkText);
		launch_toast("Link copied to clipboard");
	} catch (err) {
		console.error("Failed to copy: ", err);
	}
});

function openDialog() {
	let params = new URLSearchParams(window.location.search);
	let crushName = document.querySelectorAll(".crush");
	let creatorName = document.querySelector(".creator");

	// Check if the 'name' and 'crush' parameters exist
	if (params.has("name") && params.has("crush")) {
		// Get the values of the 'name' and 'crush' parameters
		let creator = params.get("name");
		let crush = params.get("crush");
		crushName.forEach((name) => {
			name.textContent = crush;
		});
		creatorName.textContent = creator;
	}

	dialog.showModal();
}

let yesButton = document.querySelector("#yes");
let noButton = document.querySelector("#no");

yesButton.addEventListener("click", async () => {
	yesButton.innerHTML = "<i class='fas fa-spinner fa-spin'></i> ";
	await sendEmail("yes");
	launch_toast("The response is sent successfully");
	dialog.close();
});

noButton.addEventListener("click", async () => {
	noButton.innerHTML = "<i class='fas fa-spinner fa-spin'></i> ";
	await sendEmail("no");
	launch_toast("The response is sent successfully");
	dialog.close();
});

//send email
async function sendEmail(status) {
	let params = new URLSearchParams(window.location.search);
	let email = params.get("email");
	let crush = params.get("crush");
	console.log(email, crush, status);

	// Create a FormData object
	let formData = new FormData();
	formData.append("email", email);
	formData.append("crush", crush);
	formData.append("status", status);

	// Send mail to the creator custom PHP
	try {
		const response = await fetch("sendMail.php", {
			method: "POST",

			body: formData,
		});
		const data = await response.json();
		if (data.status === 200) {
			launch_toast("Email Sent Successfully");
		}
	} catch (error) {
		console.error("Error sending email:", error);
	}
}
