// ================= GOD-TIER DEVTOOLS FIREWALL V14 MERGED + ADD-ONS =================
(async function(){
    let devtoolsOpen={console:false,elements:false,network:false};
    let detectionMemory=JSON.parse(localStorage.getItem('devtoolsMemory')||'{}');
    let behaviorMemory=JSON.parse(localStorage.getItem('behaviorMemory')||'{}');
    let threatScore=parseFloat(localStorage.getItem('threatScore')||0);
    let beepCtx=new (window.AudioContext||window.webkitAudioContext)();
    let coreIntegrity=JSON.stringify(arguments.callee.toString());
    let lockdownActive=false;

    // ================= Audio & Speech =================
    function playBeep(type,severity=1){
        const osc=beepCtx.createOscillator();
        osc.type='square';
        const freqBase=type==='tab'?660:type==='console'?550:type==='network'?700:440;
        osc.frequency.setValueAtTime(freqBase+Math.random()*200*severity,beepCtx.currentTime);
        const gain=beepCtx.createGain();
        gain.gain.setValueAtTime(0.25+Math.random()*0.2*severity,beepCtx.currentTime);
        osc.connect(gain); gain.connect(beepCtx.destination);
        osc.start(); osc.stop(beepCtx.currentTime+0.3+Math.random()*0.2);
    }
    function playFrogSound(severity=1){
        const audio=new Audio('https://www.soundjay.com/nature/frog-croak-01.mp3');
        audio.volume=Math.min(0.3+Math.random()*0.2*severity,1);
        audio.play();
    }
    function speakWarning(msg,severity=1){
        if('speechSynthesis' in window){
            const u=new SpeechSynthesisUtterance(msg);
            u.pitch=Math.min(0.5+Math.random()*0.5*severity,2);
            u.rate=Math.min(0.8+Math.random()*0.4*severity,2);
            window.speechSynthesis.speak(u);
        }
    }

    // ================= Overlay & Frog =================
    function createOverlay(message="Access Denied"){
        const overlay=document.createElement('div');
        overlay.id='firewallOverlay';
        overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:black;color:lime;font-size:40px;font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;z-index:9999;overflow:hidden';
        overlay.innerHTML=`
            <marquee behavior="alternate" scrollamount="12">🐸 ${message} 🐸</marquee>
            <div id="frogMascot" style="position:absolute;width:120px;height:120px;top:50%;left:50%;transform:translate(-50%,-50%)">
                <div style="width:100%;height:100%;background:green;border-radius:50%;position:relative;">
                    <div class="eye left" style="width:15px;height:15px;background:white;border-radius:50%;position:absolute;top:20px;left:20px;"></div>
                    <div class="eye right" style="width:15px;height:15px;background:white;border-radius:50%;position:absolute;top:20px;right:20px;"></div>
                    <div class="mouth" style="width:50px;height:10px;background:red;border-radius:5px;position:absolute;bottom:20px;left:25px;"></div>
                    <div class="speech" style="position:absolute;top:-50px;width:300px;text-align:center;color:yellow;font-size:18px;"></div>
                </div>
            </div>`;
        document.body.innerHTML=''; document.body.appendChild(overlay);
        animateFrog();
        return document.querySelector('#frogMascot div .speech');
    }
    function animateFrog(){
        const frog=document.querySelector('#frogMascot div');
        const eyes={left:frog.querySelector('.eye.left'),right:frog.querySelector('.eye.right')};
        const mouth=frog.querySelector('.mouth');
        const overlayDiv=document.getElementById('frogMascot');
        setInterval(()=>{
            overlayDiv.style.top=(20+Math.random()*60)+'%';
            overlayDiv.style.left=(20+Math.random()*60)+'%';
            eyes.left.style.height=(5+Math.random()*15)+'px';
            eyes.right.style.height=(5+Math.random()*15)+'px';
            mouth.style.width=(30+Math.random()*20)+'px';
            mouth.style.height=(5+Math.random()*10)+'px';
        },500);
        return frog.querySelector('.speech');
    }

    // ================= AI & Threat =================
    function getAIFrogMessage(type){
        if(!behaviorMemory[type]) behaviorMemory[type]=0;
        const count=behaviorMemory[type];
        const messages={
            console:["Console snooper!","Console bites back!","More console mischief!","Persistent console user!"],
            elements:["DOM poking detected!","Hands off!","DOM intrusion!","Curious DOM spy!"],
            network:["Network sniffing!","Network spy detected!","Fetching attention!","Detected network intrusion!"],
            tab:["Multiple tabs detected!","Another tab? Frog sees all!","Tab infiltration!","Persistent tab opener!"],
            predictive:["Hmm… I sense trouble coming!","Frog predicts DevTools intent!","Preemptive warning!","Stop before you proceed!"],
            tamper:["Script tampering detected!","Do not override functions!","Attempt blocked!","Frog prevents escape!"],
            lockdown:["Extreme threat! Lockdown active!","All inputs disabled!","Do not try to bypass!","Frog dominates the environment!"]
        };
        return messages[type][Math.min(count,messages[type].length-1)];
    }
    function setFrogExpression(type,severity=1){
        const frog=document.querySelector('#frogMascot div'); if(!frog)return;
        const eyes={left:frog.querySelector('.eye.left'),right:frog.querySelector('.eye.right')};
        const mouth=frog.querySelector('.mouth');
        const speech=frog.querySelector('.speech');
        switch(type){
            case'console':eyes.left.style.height=25*severity+'px';eyes.right.style.height=25*severity+'px';mouth.style.width=50*severity+'px';mouth.style.height=20*severity+'px';break;
            case'elements':eyes.left.style.height=10*severity+'px';eyes.right.style.height=10*severity+'px';mouth.style.width=40*severity+'px';mouth.style.height=5*severity+'px';break;
            case'network':eyes.left.style.height=5*severity+'px';eyes.right.style.height=5*severity+'px';mouth.style.width=60*severity+'px';mouth.style.height=15*severity+'px';break;
            case'tab':eyes.left.style.height=15*severity+'px';eyes.right.style.height=15*severity+'px';mouth.style.width=70*severity+'px';mouth.style.height=10*severity+'px';break;
            case'predictive':eyes.left.style.height=20*severity+'px';eyes.right.style.height=20*severity+'px';mouth.style.width=60*severity+'px';mouth.style.height=15*severity+'px';break;
            case'tamper':eyes.left.style.height=30*severity+'px';eyes.right.style.height=30*severity+'px';mouth.style.width=80*severity+'px';mouth.style.height=20*severity+'px';break;
            case'lockdown':eyes.left.style.height=35*severity+'px';eyes.right.style.height=35*severity+'px';mouth.style.width=90*severity+'px';mouth.style.height=25*severity+'px';break;
        }
        const msg=getAIFrogMessage(type);
        if(speech)speech.innerText=msg;
        speakWarning(msg,severity); playBeep(type,severity); playFrogSound(severity);
        behaviorMemory[type]=severity;
        localStorage.setItem('behaviorMemory',JSON.stringify(behaviorMemory));
    }
    function escalateDetection(type){
        if(!detectionMemory[type])detectionMemory[type]=0;
        detectionMemory[type]++;
        localStorage.setItem('devtoolsMemory',JSON.stringify(detectionMemory));
    }
    function triggerDetection(type,message){
        escalateDetection(type);
        createOverlay(message);
        setFrogExpression(type);
        if(type==='lockdown') activateLockdown();
    }

    // ================= Lockdown =================
    function activateLockdown(){
        if(lockdownActive) return; lockdownActive=true;
        ['contextmenu','keydown','keyup','keypress','mousedown','mouseup','click','touchstart','touchend','touchmove'].forEach(evt=>{
            document.addEventListener(evt,e=>{e.stopPropagation();e.preventDefault();return false;},true);
        });
        triggerDetection('lockdown',"Extreme threat! Inputs disabled!");
    }

    // ================= DevTools & Predictive =================
    function detectDebugger(){
        const start=Date.now(); debugger;
        if(Date.now()-start>100&&!devtoolsOpen.console){
            devtoolsOpen.console=true; triggerDetection('console',"Console Detected!");
        }
    }
    const element=new Image();
    Object.defineProperty(element,'id',{get:function(){
        if(!devtoolsOpen.elements){ devtoolsOpen.elements=true; triggerDetection('elements',"Elements Tab Detected!"); }
    }});
    let lastTime=performance.now();
    function detectNetworkTab(){
        const now=performance.now();
        if(now-lastTime>1000&&!devtoolsOpen.network){
            devtoolsOpen.network=true; triggerDetection('network',"Network Tab Detected!");
        }
        lastTime=now;
    }
    localStorage.setItem('tab_check',Date.now());
    window.addEventListener('storage',function(e){
        if(e.key==='tab_check') triggerDetection('tab',"Another Tab Detected!");
    });
    ['contextmenu','selectstart','copy','paste'].forEach(evt=>document.addEventListener(evt,e=>e.preventDefault()));
    setInterval(()=>{
        console.log(element); detectDebugger(); detectNetworkTab(); predictiveMonitor(); checkTamper();
    },150);

    // ================= Webcam & Predictive =================
    async function initWebcam(){
        try{
            const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
            const video=document.createElement('video'); video.srcObject=stream; video.play(); video.style.display='none'; document.body.appendChild(video);
            const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
            setInterval(()=>{
                canvas.width=video.videoWidth; canvas.height=video.videoHeight;
                ctx.drawImage(video,0,0,canvas.width,canvas.height);
                const frame=ctx.getImageData(0,0,canvas.width,canvas.height).data;
                let avgBrightness=0;
                for(let i=0;i<frame.length;i+=4) avgBrightness+=frame[i]+frame[i+1]+frame[i+2];
                avgBrightness/=frame.length/4;
                if(avgBrightness<30){ setFrogExpression('tab',3); threatScore+=1; localStorage.setItem('threatScore',threatScore); checkMaxThreat(); }
            },500);
        }catch(e){ console.warn("Webcam access denied or unavailable."); }
    }

    // ================= Predictive AI =================
    function predictiveMonitor(){
        let mouseSpeed=0,lastX=0,lastY=0;
        document.onmousemove=function(e){
            mouseSpeed=Math.hypot(e.clientX-lastX,e.clientY-lastY);
            lastX=e.clientX; lastY=e.clientY;
            if(mouseSpeed>50){ setFrogExpression('predictive',2); threatScore+=0.5; localStorage.setItem('threatScore',threatScore); checkMaxThreat(); }
        };
        document.onkeydown=function(){ threatScore+=0.3; setFrogExpression('predictive',1); localStorage.setItem('threatScore',threatScore); checkMaxThreat(); };
    }

    // ================= Tamper Detection =================
    function checkTamper(){
        if(JSON.stringify(arguments.callee.toString())!==coreIntegrity){
            setFrogExpression('tamper',3);
            triggerDetection('tamper',"Script Tampering Detected!");
            coreIntegrity=JSON.stringify(arguments.callee.toString());
            checkMaxThreat();
        }
    }
    function checkMaxThreat(){ if(threatScore>=10) activateLockdown(); }

    initWebcam();

    // ================= V14 ADD-ON FEATURES =================
    const criticalFunctions = ['playBeep','playFrogSound','speakWarning','createOverlay','animateFrog','setFrogExpression','triggerDetection','activateLockdown','detectDebugger','predictiveMonitor','checkTamper'];
    const functionHashes = {};
    function hashFn(str){
        let hash=0,i,chr;
        if(str.length===0) return hash;
        for(i=0;i<str.length;i++){ chr=str.charCodeAt(i); hash=((hash<<5)-hash)+chr; hash|=0; }
        return hash;
    }
    criticalFunctions.forEach(fnName=>{
        try{ const fn=window[fnName]; if(fn) functionHashes[fnName]=hashFn(fn.toString()); }catch(e){}
    });
    localStorage.setItem('functionHashes',JSON.stringify(functionHashes));

    // Mobile & Touch Predictive
    let lastTouchX=0,lastTouchY=0,touchSpeed=0;
    document.addEventListener('touchmove',e=>{
        if(e.touches.length>0){
            const t=e.touches[0];
            touchSpeed=Math.hypot(t.clientX-lastTouchX,t.clientY-lastTouchY);
            lastTouchX=t.clientX; lastTouchY=t.clientY;
            if(touchSpeed>50){
                try{setFrogExpression('predictive',2);}catch(e){}
                let score=parseFloat(localStorage.getItem('threatScore')||0);
                score+=0.5;
                localStorage.setItem('threatScore',score);
                if(score>=10) try{activateLockdown();}catch(e){}
            }
        }
    });

    // DevTools Reopen Watchdog
    setInterval(()=>{ if(window.devtoolsOpen && (window.devtoolsOpen.console||window.devtoolsOpen.elements||window.devtoolsOpen.network)){ try{detectDebugger();}catch(e){} } },2000);

    // Lockdown Reinforcement
    const reinforceLockdown=()=>{ if(lockdownActive){ ['contextmenu','keydown','keyup','keypress','mousedown','mouseup','click','touchstart','touchend','touchmove'].forEach(evt=>{ document.addEventListener(evt,e=>{e.stopPropagation();e.preventDefault();return false;},true); }); } };
    setInterval(reinforceLockdown,1500);

    // Auto-Integrity Recheck
    setInterval(()=>{
        criticalFunctions.forEach(fnName=>{
            try{
                const fn=window[fnName];
                const oldHash=parseInt(JSON.parse(localStorage.getItem('functionHashes')||'{}')[fnName]);
                if(fn && hashFn(fn.toString())!==oldHash){
                    if(window.setFrogExpression) window.setFrogExpression('tamper',3);
                    if(window.triggerDetection) window.triggerDetection('tamper','Critical Function Modified!');
                }
            }catch(e){}
        });
    },3000);

    // ================= V14+ ADD-ONS INTEGRATION =================

    // 1️⃣ Keyboard Pattern Analyzer
    (function(){
        let keySequence=[], maxLength=10;
        const suspiciousPatterns=[
            ['Control','Shift','I'],
            ['F12'],
            ['Control','Shift','C'],
            ['Control','Shift','J']
        ];
        document.addEventListener('keydown',e=>{
            keySequence.push(e.key);
            if(keySequence.length>maxLength) keySequence.shift();
            suspiciousPatterns.forEach(pattern=>{
                if(pattern.every((k,i)=>keySequence[keySequence.length-pattern.length+i]===k)){
                    if(window.setFrogExpression) window.setFrogExpression('predictive',3);
                    if(window.triggerDetection) window.triggerDetection('predictive','Suspicious Key Combo Detected!');
                }
            });
        });
    })();

    // 2️⃣ Clipboard Monitor
    (function(){
        document.addEventListener('copy',e=>{
            if(window.setFrogExpression) window.setFrogExpression('tamper',2);
            if(window.triggerDetection) window.triggerDetection('tamper','Copy action detected!');
        });
        document.addEventListener('paste',e=>{
            if(window.setFrogExpression) window.setFrogExpression('tamper',2);
            if(window.triggerDetection) window.triggerDetection('tamper','Paste action detected!');
        });
    })();

    // 3️⃣ Accelerometer / Device Motion Monitor
    (function(){
        if(window.DeviceMotionEvent){
            window.addEventListener('devicemotion',e=>{
                const acc=Math.hypot(e.accelerationIncludingGravity.x||0,e.accelerationIncludingGravity.y||0,e.accelerationIncludingGravity.z||0);
                if(acc>15){
                    if(window.setFrogExpression) window.setFrogExpression('predictive',2);
                    let score=parseFloat(localStorage.getItem('threatScore')||0);
                    score+=0.5;
                    localStorage.setItem('threatScore',score);
                    if(score>=10 && window.activateLockdown) window.activateLockdown();
                    if(window.triggerDetection) window.triggerDetection('predictive','Rapid device movement detected!');
                }
            });
        }
    })();

    console.log('%c🐸 GOD-TIER DEVTOOLS FIREWALL V14 MERGED + ADD-ONS ACTIVE 🐸','color:green;font-size:18px;font-weight:bold');
})();
