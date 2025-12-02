// Animated Background: Floating Nodes + Edges (responsive)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Node(x, y, vx, vy, r, color) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.r = r;
    this.color = color;
}

const NODES = 22;
const nodes = [];
for(let i=0; i<NODES; i++) {
    let angle = Math.random()*2*Math.PI;
    let speed = 0.3 + Math.random()*0.6;
    let r = 14 + Math.random()*14;
    nodes.push(new Node(
        Math.random()*window.innerWidth,
        Math.random()*window.innerHeight,
        Math.cos(angle)*speed, Math.sin(angle)*speed,
        r, `rgba(${120+Math.random()*80},${180+Math.random()*60},${220+Math.random()*30},0.62)`
    ));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    for(let i=0; i<NODES; i++) {
        for(let j=i+1; j<NODES; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 190) {
                ctx.strokeStyle = `rgba(140,190,230,${0.06+Math.random()*0.09})`;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }

    // Draw nodes
    for(let i=0; i<NODES; i++) {
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, 2*Math.PI);
        ctx.fillStyle = nodes[i].color;
        ctx.shadowColor = 'rgba(55,155,225,0.15)';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r*0.46, 0, 2*Math.PI);
        ctx.fillStyle = "rgba(18,34,67,0.20)";
        ctx.fill();
    }

    for(let i=0; i<NODES; i++) {
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        if(nodes[i].x < -40 || nodes[i].x > canvas.width+40) nodes[i].vx *= -1;
        if(nodes[i].y < -40 || nodes[i].y > canvas.height+40) nodes[i].vy *= -1;
    }

    requestAnimationFrame(animate);
}

animate();