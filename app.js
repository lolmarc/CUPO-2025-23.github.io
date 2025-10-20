(function(){
  const voucherView = document.getElementById('voucher-view');
  const redeemedView = document.getElementById('redeemed-view');
  const redeemBtn = document.getElementById('redeemBtn');
  const backBtn = document.getElementById('backBtn');
  const confettiBtn = document.getElementById('confettiBtn');
  const printBtn = document.getElementById('printBtn');
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  function setView(redeemed){
    if(redeemed){
      voucherView.classList.add('hidden');
      redeemedView.classList.remove('hidden');
    }else{
      redeemedView.classList.add('hidden');
      voucherView.classList.remove('hidden');
    }
  }

  // Persist redeemed state in localStorage
  const KEY = 'voucher-ager-redeemed';
  setView(localStorage.getItem(KEY) === '1');

  redeemBtn.addEventListener('click', () => {
    if(confirm('Vols canviar el cupó ara?')){
      localStorage.setItem(KEY, '1');
      setView(true);
      launchConfetti();
    }
  });

  backBtn.addEventListener('click', () => {
    setView(false);
  });

  printBtn.addEventListener('click', () => window.print());

  // Confetti
  let W,H,particles=[]; 
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  function rand(min,max){ return Math.random()*(max-min)+min }
  function hsl(h,s,l){ return `hsl(${h} ${s}% ${l}%)` }

  function makePiece(){
    const size = rand(6,12);
    return {
      x: rand(0,W),
      y: -20,
      vx: rand(-1,1),
      vy: rand(2,5),
      size,
      rot: rand(0,Math.PI*2),
      vr: rand(-0.1,0.1),
      color: Math.random()<0.5 ? hsl(8,60,60) : hsl(345,70,66) // soft romantic reds
    }
  }

  function launchConfetti(){
    for(let i=0;i<220;i++) particles.push(makePiece());
  }

  function tick(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
      ctx.restore();
    });
    particles = particles.filter(p => p.y < H+30);
    requestAnimationFrame(tick);
  }
  tick();

  confettiBtn.addEventListener('click', launchConfetti);
})();