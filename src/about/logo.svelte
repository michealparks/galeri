<svg viewBox="0 0 1024 1024">
  <path
     fill="#2C3E50"
     d="M0,512 a60,60 0 0,0 1024,0" />
  <path
     fill="#2C3E50"
     d="M1024,512 a60,60 0 1,0 -1024,0" />
  <path
     d="M881.76 269.44c-43.36 52.704-162.24 198.24-256.672 313.92l-119.904-121.728c108.448-96.512 242.688-215.808 291.2-258.528 86.304-76.064 161.984-121.312 178.432-102.816 10.304 10.24-17.056 76.672-93.056 169.152zM604.128 608.96c-36.576 44.768-68.064 83.328-87.328 106.976l-141.952-138.336c23.008-20.48 61.312-54.56 105.728-94.048l123.552 125.408zM495.648 741.856v-0.384c-82.4 316.16-448.576 134.4-448.576 134.4s153.632 19.36 153.632-123.936c0-138.912 141.184-151.456 149.856-152.096l145.376 141.664c0 0.032-0.288 0.352-0.288 0.352z"
     fill="#fff"
     transform="translate(140, 140) scale(0.70) rotate(0, 512, 512)" />
</svg>

<style>
	svg {
		height: 60px;
		width: 60px;
		opacity: 0;
		transform: translate(15px, 0);
		animation-name: enter;
		animation-duration: 700ms;
		animation-fill-mode: forwards;
		border: 5px solid #eee;
		border-radius: 100%;
	}

	@keyframes enter {
		0%   { transform: scale(0.0) translate(15px, 0); opacity: 0; }
		60%  { transform: scale(1.05) translate(0, 0); }
		80%  { transform: scale(0.97) translate(0, 0); }
		100% { transform: scale(1.0) translate(0, 0); opacity: 1; } 
	}
</style>