(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
function indexEJS() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo(".head",
    { y: -100, opacity: 0, filter: "blur(10px)", duration: 2 },
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
      filter: "blur(0px)"
    }
  );
  gsap.fromTo(".single-card",
    {
     scale:0,
     y:-200
    },
    {
      y:0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".cards-main-div",   // jese hi index-div viewport me aaye
        start: "top top",
        marker:true,
        scale:1,
        pin:true,
        scrub:2,
        markers: true   
      }
    }
  );


}
indexEJS()
