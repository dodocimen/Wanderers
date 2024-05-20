

// FOR POPUP BUTTN
function flipButton(element) {
    element.querySelector('.flipper').classList.toggle('flipped');
}


// Global variables
let rareWandererAttributes = [
    {
      name: "Flash",
      color: [0, 255, 255], // Silver color
      diameter: 55,
      speedRange: [10, 50],
      gravity: 0.5,
      bounce: 0.6,
      behavior: "spiral",
      particleColor: [192, 192, 255],
      messages: ["ENERGY", "DO IT AGAIN", "THROW ME TO THE WALL"],
      touchMessages: ["MOVE", "Don't slow me down!","I'm in a hurry!"],
      glowColor: [255, 0],
      dynamicSize: false,
      spawnProbability: 0.005, // % chance to spawn
      
    },
    {
      name: "Bird",
      color: [205, 0, 110], // Bronze color
      diameter: 55,
      speedRange: [5, 28],
      gravity: 0.01,
      bounce: 0.5,
      behavior: "bouncing",
      particleColor: [255, 140, 0],
      messages: [
        "You're not supposed to touch me!",
        "How did you catch me!",
        "This is not good for my gravity.",
      ],
      touchMessages: ["Careful, I'm precious!", "Please be gentle!","Don't touch!"],
      glowColor: [255, 0],
      dynamicSize: false,
      spawnProbability: 0.005, // % chance to spawn
    },
    {
      name: "Frost",
      color: [173, 216, 230], // Light blue color
      diameter: 55,
      speedRange: [3, 30],
      gravity: 0.4,
      bounce: 0.6,
      behavior: "brighten",
      particleColor: [173, 216, 230],
      messages: ["Thats not cool", "You're too warm!", "Chill out"],
      touchMessages: ["You look brighter!", "Frostbite!","Sorry!"],
      glowColor: [0, 255, 255, 90],
      dynamicSize: false,
      spawnProbability: 0.009, // % chance to spawn
    },
    {
      name: "Phoenix",
      color: [255, 69, 0], // Orange-red color
      diameter: 55,
      speedRange: [3, 20],
      gravity: 0.3,
      bounce: 0.5,
      behavior: "ignite",
      particleColor: [255, 165, 0],
      messages: [
        "Hey you're gonna burn yourself!",
        "You're gonna put me off!",
        "Come on man",
        "Please let go",
      ],
      touchMessages: ["Careful,hot!", "Don't get burned!","Sorry!"],
      glowColor: [255, 140, 0],
      dynamicSize: true,
      spawnProbability: 0.005, // % chance to spawn
    },
    {
      name: "Destroyer",
      color: [], // Remove the fixed black color
      diameter: 55,
      speedRange: [3, 20],
      gravity: 0.3,
      bounce: 0.5,
      behavior: "explode",
      particleColor: [255, 0, 0],
      messages: ["RELEASE NOW", "LET GO", "HEY STOP IT"],
      touchMessages: ["Aand gone", "You asked for it!", "BYE","whoops"],
      glowColor: [255, 0, 0, 0],
      dynamicSize: false,
      spawnProbability: 0.005, // % chance to spawn
    },
  ];
  
  window.wandererTimeoutStarted = false;
  let wanderers = [];
  let groundLevel = 600; // Adjust this value based on your preference
  let messages = [
    "hey",
    "what's up",
    "beautiful weather!",
    "life is good!",
    "Hello there!",
    "Feeling great today!",
  ];
  let touchMessages = [
    "HEY!",
    "NO TOUCH!",
    "OW!",
    "GO AWAY!",
    "OUCH!",
    "Stop touching!",
    "Avoid contact!",
  ];
  let panicMessages = [
    "RUN!",
    "OH NO THEY GOT HIM!",
    "THEY GOT DAVE!",
    "Hey! that's my friend!",
    "Hey, leave them alone!",
  ];
  let crowdedMessages = [
    "Hey where are you all coming from?",
    "What is happening",
    "Enough Wanderers!",
    "Hey that's enough!",
  ];
  let numWanderers = 2;
  let activeWanderer = null;
  let prevWindowWidth, prevWindowHeight;
  let canvasBackgroundColor = 255; // Light mode by default (white)
  let isDragging = false; // Flag to check if info window is being dragged
  let dragOffsetX, dragOffsetY; // Variables to store offset during drag
  let inspectionZone;
  let popupTimeout;
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
    textSize(16);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < numWanderers; i++) {
      spawnWanderer();
    }
    frameRate(60);
    button = select("#addButton");
    button.mousePressed(addWanderer);
    prevWindowWidth = windowWidth;
    prevWindowHeight = windowHeight;
    const infoWindow = document.getElementById("infoWindow");
    
  
    if (windowWidth > 600) {
      infoWindow.addEventListener("mousedown", startDrag);
      infoWindow.addEventListener("touchstart", startDragTouch);
      window.addEventListener("mousemove", doDrag);
      window.addEventListener("touchmove", doDragTouch);
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchend", stopDrag);
    }
  
    inspectionZone = document.getElementById("inspectionZone");
  
    // Event listeners for inspection zone
    inspectionZone.addEventListener("mouseenter", onInspectionZoneHover);
    inspectionZone.addEventListener("mouseleave", onInspectionZoneLeave);
  }
  
  function draw() {
    background(canvasBackgroundColor);
    for (let i = wanderers.length - 1; i >= 0; i--) {
      wanderers[i].update();
      if (wanderers[i].visible) {
        wanderers[i].show(); // Only show wanderers that are visible
      }
      wanderers[i].particles.forEach((particle) => particle.show());
      if (wanderers[i].toRemove) {
        wanderers.splice(i, 1);
      }
    }
    let isCursorOverWanderer = false;
    for (let i = wanderers.length - 1; i >= 0; i--) {
      let wanderer = wanderers[i];
      wanderer.update();
      if (wanderer.toRemove) {
        wanderers.splice(i, 1);
        continue;
      }
      wanderer.displayMessage();
      if (dist(mouseX, mouseY, wanderer.x, wanderer.y) < wanderer.diameter / 2) {
        isCursorOverWanderer = true;
      }
    }
    cursor(isCursorOverWanderer ? "pointer" : "auto");
    fill(60); // Grey color for the ground
    rect(0, groundLevel, width, height - groundLevel); // Draw the ground
  }
  
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    canvasBackgroundColor = document.body.classList.contains("dark-mode")
      ? 30
      : 255; // Dark grey for dark mode or white for light mode
  }

  
  
  function windowResized() {
    let widthChange = windowWidth - prevWindowWidth;
    let heightChange = windowHeight - prevWindowHeight;

    // Adjust ground level based on screen width
    if (windowWidth > 1440) {
        groundLevel = 800; // Lower ground level for larger screens
    } else {
        groundLevel = 600; // Default ground level
    }

    wanderers.forEach((wanderer) => {
        wanderer.xVelocity += widthChange * 0.05;
        wanderer.yVelocity += heightChange * 0.05;
    });

    resizeCanvas(windowWidth, windowHeight);
    prevWindowWidth = windowWidth;
    prevWindowHeight = windowHeight;
}

  
  function closePopup(popupId) {
    if (popupId) {
      document.getElementById(popupId).style.display = "none";
    } else {
      document.getElementById("popup").style.display = "none";
    }
  }
  
  function spawnWanderer() {
    let totalProbability = rareWandererAttributes.reduce(
      (sum, attr) => sum + attr.spawnProbability,
      0
    );
    let rand = random(1);
    let isRare = rand < totalProbability;
    let initialColor,
      diameter,
      speedRange,
      gravity,
      bounce,
      behavior,
      particleColor,
      messages,
      glowColor,
      dynamicSize,
      touchMessages,
      name;
    if (isRare) {
      let cumulativeProbability = 0;
      for (let i = 0; i < rareWandererAttributes.length; i++) {
        cumulativeProbability += rareWandererAttributes[i].spawnProbability;
        if (rand < cumulativeProbability) {
          let rareAttributes = rareWandererAttributes[i];
          initialColor = rareAttributes.color.length
            ? color(...rareAttributes.color)
            : color(random(255), random(255), random(255)); // Random color for Destroyer
          diameter = rareAttributes.diameter;
          speedRange = rareAttributes.speedRange;
          gravity = rareAttributes.gravity;
          bounce = rareAttributes.bounce;
          behavior = rareAttributes.behavior;
          particleColor = color(...rareAttributes.particleColor);
          messages = rareAttributes.messages;
          glowColor = color(...rareAttributes.glowColor);
          dynamicSize = rareAttributes.dynamicSize;
          touchMessages = rareAttributes.touchMessages; // Assign touchMessages
          name = rareAttributes.name; // Assign the name
          break;
        }
      }
    } else {
      initialColor = color(random(100, 255), random(100, 255), random(100, 255));
      diameter = 55;
      speedRange = [3, 34];
      gravity = 0.5;
      bounce = 0.6;
      behavior = "normal";
      particleColor = initialColor;
      messages = [
        "LET GO!",
        "NOO!",
        "IM SCARED!",
        "AAAA!",
        "THIS IS HOW IT ENDS!",
        "RELEASE ME!",
        "LET ME GO!",
        "WHY ME?",
      ];
      glowColor = null;
      dynamicSize = false;
      touchMessages = null; // No custom touch messages for normal wanderers
      name = null; // No name for normal wanderers
    }
    let button = select("#addButton");
    let buttonX = button.position().x + button.width / 2;
    let buttonY = button.position().y + button.height;
    let newWanderer = new Wanderer(
      buttonX,
      buttonY,
      diameter,
      gravity,
      bounce,
      initialColor,
      isRare,
      behavior,
      particleColor,
      messages,
      glowColor,
      dynamicSize,
      touchMessages,
      name
    );
    let angle = PI / 2.6; // Launch at an angle
    let speed = random(speedRange[0], speedRange[1]); // Launch speed
    newWanderer.xVelocity = cos(angle) * speed;
    newWanderer.yVelocity = sin(angle) * speed;
    wanderers.push(newWanderer);
  }
  
  function addWanderer() {
    if (wanderers.length >= 20) {
      if (!window.wandererTimeoutStarted) {
        window.wandererTimeoutStarted = true;
        setTimeout(fadeOutRandomWanderers, 3000); // 3000 milliseconds = 3 seconds
      }
      const warnings = [
        "OH NO TOO MUCH ANXIOUS WANDERERS!",
        "YOU'RE STRESSING THEM OUT!",
        "THAT'S ENOUGH WANDERERS!",
        "THIS IS NOT GOOD!",
      ];
      document.getElementById("popup-message").textContent =
        warnings[Math.floor(Math.random() * warnings.length)];
      document.getElementById("popup").style.display = "flex";
    } else {
      window.wandererTimeoutStarted = false;
      reductionTriggered = false; // Resetting the reduction trigger flag
      spawnWanderer();
      triggerCrowdedMessages();
    }
  }
  
  function triggerCrowdedMessages() {
    if (wanderers.length > 1) {
      let randomIndex = Math.floor(Math.random() * wanderers.length);
      let wanderer = wanderers[randomIndex];
      wanderer.message = random(crowdedMessages);
      wanderer.messageTimer = 120; // Display message for 2 seconds
    }
  }
  
  let reductionTriggered = false;
  function fadeOutRandomWanderers() {
    if (!reductionTriggered && wanderers.length > 2) {
      let toFadeOut = wanderers.length - 2;
      let fadedCount = 0;
      wanderers.forEach((wanderer) => {
        if (!wanderer.fadingOut && fadedCount < toFadeOut) {
          wanderer.fadingOut = true;
          wanderer.fadeCounter = 0;
          fadedCount++;
        }
      });
      reductionTriggered = true; // Prevent further reduction
    }
  }
  
  class Wanderer {
    constructor(
      x,
      y,
      diameter,
      gravity,
      bounce,
      initialColor,
      isRare,
      behavior,
      particleColor,
      messages,
      glowColor,
      dynamicSize,
      touchMessages = null,
      name = null
    ) {
      this.x = x;
      this.y = y;
      this.diameter = diameter;
      this.gravity = gravity;
      this.bounce = bounce;
      this.xVelocity = 0;
      this.yVelocity = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.initialColor = initialColor;
      this.color = color(initialColor);
      this.originalColor = color(initialColor);
      this.particles = [];
      this.isExploding = false;
      this.fadingOut = false;
      this.fadeCounter = 0;
      this.shakingDuration = 300;
      this.hasExploded = false;
      this.visible = true;
      this.shakeIntensity = 0;
      this.holdTimer = 0;
      this.specialExplosionTriggered = false;
      this.isRare = isRare;
      this.behavior = behavior;
      this.particleColor = particleColor;
      this.messages = messages;
      this.glowColor = glowColor;
      this.dynamicSize = dynamicSize;
      this.touchMessages = touchMessages;
      this.name = name; // Assign name
      this.brightenTimer = 0; // Initialize the brighten timer
      this.trails = []; // Initialize trails for "Flash"
      this.blinking = false; // Initialize blinking state for Snatcher
      this.blinkingTimer = 0; // Initialize blinking timer for Snatcher
      this.cooldown = false; // Initialize cooldown for "Destroyer"
      this.frozen = false; // Initialize frozen state for Frost
      this.freezeTimer = 0; // Initialize freeze timer for Frost
    this.ignited = false; // Initialize ignited state for Phoenix interaction
    this.igniteTimer = 0; // Initialize ignite timer for Phoenix interaction
    this.igniteTrail = []; // Initialize trail for ignited wanderers
    }
  
    update() {
        if (this.frozen) {
          this.freezeTimer--;
          if (this.freezeTimer <= 0) {
            this.frozen = false;
            this.color = this.originalColor;
          }
          return; // Skip other updates if frozen
        }
      
        if (this.ignited) {
          this.igniteTimer--;
          if (this.igniteTimer <= 0) {
            this.ignited = false;
            this.color = this.originalColor;
            this.bounce = 0.6; // Revert to original bounce
            this.igniteTrail = []; // Clear the trail
          } else {
            this.color = color(255, 0, 0); // Ensure color remains red
            this.addIgniteTrail(); // Add ignite trail
            this.message = random(this.igniteMessages); // Ensure ignite message is displayed
          }
        }
      
        if (this.dynamicSize) {
          this.diameter = this.diameter + sin(frameCount * 0.1) * 1.2; // Dynamic size change
        }
        if (this.behavior === "zigzag") {
          this.x += sin(frameCount * 0.2) * 4; // Zigzag movement
        } else if (this.behavior === "spiral") {
          let angle = frameCount * 0.1;
          this.x += cos(angle) * 5;
          this.y += sin(angle) * 1;
        } else if (this.behavior === "brighten") {
          this.brightenOtherWanderers(); // Add this line for the new behavior
        } else if (this.behavior === "explode") {
          this.explodeOtherWanderers(); // Add this line for the "Destroyer" behavior
        }
      // Add trail effect for "Flash"
      if (this.name === "Flash") {
        this.addTrail();
        this.updateTrails();
      }
  
      if (this.fadingOut) {
        this.fadeCounter++;
        if (this.fadeCounter <= this.shakingDuration) {
          this.color = lerpColor(this.color, color(255, 0, 0), 0.1);
          this.x += random(-2, 2);
          this.y += random(-2, 2);
        } else if (!this.hasExploded && this.fadeCounter > this.shakingDuration) {
          this.visible = false;
          if (!this.isExploding) {
            this.startExplosion(); // Call the startExplosion method
          }
        }
      }
  
      // Handle brightening timer
      if (this.brightenTimer > 0) {
        this.brightenTimer--;
        if (this.brightenTimer === 0) {
          this.color = this.originalColor; // Revert to original color after timer
        }
      }
  
      if (this.isExploding) {
        this.particles.forEach((particle, index) => {
          particle.update();
          if (particle.isDone()) {
            this.particles.splice(index, 1);
          }
        });
        if (this.particles.length === 0 && this.hasExploded) {
          this.toRemove = true;
        }
      }
      if (this.dragging) {
        this.shakeIntensity = min(this.shakeIntensity + 0.1, 5);
        this.x =
          mouseX + this.offsetX + random(-this.shakeIntensity, this.shakeIntensity);
        this.y =
          mouseY + this.offsetY + random(-this.shakeIntensity, this.shakeIntensity);
        this.color = lerpColor(this.color, color(255, 0, 0), 0.02);
        this.holdTimer++;
        if (this.holdTimer >= 200 && !this.specialExplosionTriggered) {
          this.triggerSpecialExplosion(200, this.originalColor, 5, 10, 10, 30);
        }
        if (this.messageTimer === 0 || !this.draggingMessage) {
          this.message = random(this.messages);
          this.messageTimer = 30;
          this.draggingMessage = true;
        }
        this.causePanic();
      } else {
        this.shakeIntensity = 0;
        this.draggingMessage = false;
        this.holdTimer = 0;
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.yVelocity += this.gravity;
        this.checkCollisions();
        this.boundaryCollision();
        this.color = lerpColor(this.color, this.initialColor, 0.05); // Gradually return to original color
        if (this.messageTimer > 0) {
          this.messageTimer--;
        } else if (random(1000) < 5) {
          this.message = random(messages);
          this.messageTimer = 180;
        }
      }
      this.checkInfoWindowCollision();
    }
    startExplosion(fastFade = false) {
      if (!this.isExploding) {
        let numParticles = this.isRare ? 100 : 50;
        let particleSizeRange = this.isRare ? [25, 60] : [10, 30];
        for (let i = 0; i < numParticles; i++) {
          this.particles.push(
            new Particle(
              this.x,
              this.y,
              color(250, 112, 112),
              particleSizeRange[0],
              particleSizeRange[1],
              fastFade // Pass fastFade parameter to Particle
            )
          );
        }
        this.isExploding = true;
        this.hasExploded = true;
      }
    }
  
    triggerSpecialExplosion(
      numParticles,
      color,
      minSize,
      maxSize,
      minSpeed,
      maxSpeed
    ) {
      this.visible = false;
      numParticles = this.isRare ? numParticles * 4 : numParticles;
      minSize = this.isRare ? minSize * 6 : minSize;
      maxSize = this.isRare ? maxSize * 6 : maxSize;
      for (let i = 0; i < numParticles; i++) {
        this.particles.push(
          new Particle(
            this.x,
            this.y,
            color,
            minSize,
            maxSize,
            minSpeed,
            maxSpeed
          )
        );
      }
      this.isExploding = true;
      this.specialExplosionTriggered = true;
    }
  
    explodeOtherWanderers() {
      if (this.cooldown || !this.visible) return; // Skip if in cooldown or not visible
      wanderers.forEach((other) => {
        if (other !== this && other.visible) {
          let d = dist(this.x, this.y, other.x, other.y);
          let collisionDist = this.diameter / 2 + other.diameter / 2;
          if (d < collisionDist) {
            other.startExplosion(true); // Trigger explosion on other wanderer with fast fade
            this.color = color(255, 0, 0); // Change color to red
            setTimeout(() => {
              this.color = this.originalColor; // Revert to original color after 0.5 seconds
            }, 500);
  
            // Apply a force to move the Destroyer away from the interaction point
            let dx = this.x - other.x;
            let dy = this.y - other.y;
            let distance = dist(this.x, this.y, other.x, other.y);
            this.xVelocity = (dx / distance) * 10; // Adjust the multiplier for desired speed
            this.yVelocity = (dy / distance) * 10;
  
            this.cooldown = true; // Start cooldown
            setTimeout(() => {
              this.cooldown = false; // End cooldown after 2 seconds
            }, 2000);
          }
        }
      });
    }
  
    causePanic() {
      const panicDistance = 150;
      wanderers.forEach((other) => {
        if (
          other !== this &&
          dist(mouseX, mouseY, other.x, other.y) < panicDistance &&
          !other.dragging
        ) {
          let dx = other.x - mouseX;
          let dy = other.y - mouseY;
          let distance = dist(mouseX, mouseY, other.x, other.y);
          other.xVelocity = (dx / distance) * 4;
          other.yVelocity = (dy / distance) * 0;
          if (other.messageTimer === 0) {
            other.message = random(panicMessages);
            other.messageTimer = 60;
          }
        }
      });
    }

    checkCollisions() {
        if (this.visible) {
          wanderers.forEach((other) => {
            if (other !== this && other.visible) {
              let d = dist(this.x, this.y, other.x, other.y);
              let collisionDist = this.diameter / 2 + other.diameter / 2;
              if (d < collisionDist) {
                let overlap = 0.5 * (collisionDist - d);
                let dx = (this.x - other.x) / d;
                let dy = (this.y - other.y) / d;
                this.x += overlap * dx;
                this.y += overlap * dy;
                other.x -= overlap * dx;
                other.y -= overlap * dy;
                this.xVelocity += dx * 2;
                this.yVelocity += dy * 2;
                other.xVelocity -= dx * 2;
                other.yVelocity -= dy * 2;
                if (this.isRare && this.touchMessages) {
                  this.message = random(this.touchMessages);
                } else {
                  this.message = random(touchMessages);
                }
                this.messageTimer = 60;
                if (other.isRare && other.touchMessages) {
                  other.message = random(other.touchMessages);
                } else {
                  other.message = random(touchMessages);
                }
                other.messageTimer = 60;
      
                // If this wanderer is Frost, freeze the other wanderer and make Frost jump
                if (this.name === "Frost" && !other.frozen) {
                  other.freeze();
                  this.yVelocity = -10; // Apply upward velocity for the jump effect
                }
      
                // If this wanderer is Phoenix, ignite the other wanderer and make Phoenix jump
                if (this.name === "Phoenix" && !other.ignited) {
                  other.ignite();
                  this.yVelocity = -10; // Apply upward velocity for the jump effect
                }
              }
            }
          });
        }
      }
      
      
      
      
      
    checkInfoWindowCollision() {
      const infoWindow = document.getElementById("infoWindow");
      const rect = infoWindow.getBoundingClientRect();
      const distX = Math.abs(this.x - (rect.left + rect.width / 2));
      const distY = Math.abs(this.y - (rect.top + rect.height / 2));
      const rectHalfWidth = rect.width / 2;
      const rectHalfHeight = rect.height / 2;
      const circleRadius = this.diameter / 2;
      if (
        distX <= rectHalfWidth + circleRadius &&
        distY <= rectHalfHeight + circleRadius
      ) {
        let overlapX = rectHalfWidth + circleRadius - distX;
        let overlapY = rectHalfHeight + circleRadius - distY;
        if (this.y > rect.bottom - circleRadius) {
          this.y = rect.bottom + circleRadius;
          this.xVelocity =
            this.x < rect.left
              ? -Math.abs(this.xVelocity)
              : Math.abs(this.xVelocity);
        } else if (overlapX > overlapY) {
          if (this.y < rect.top) {
            this.y -= overlapY;
          } else {
            this.y += overlapY;
          }
          this.yVelocity *= -this.bounce;
        } else {
          if (this.x < rect.left) {
            this.x -= overlapX;
          } else {
            this.x += overlapX;
          }
          this.xVelocity *= -this.bounce;
        }
      }
    }
    show() {

        this.particles.forEach((particle) => {
            particle.show();
          });
        
          if (this.igniteTrail.length > 0) {
            noStroke();
            for (let trail of this.igniteTrail) {
              fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], trail.alpha);
              ellipse(trail.x, trail.y, this.diameter - 5);
              trail.alpha -= 15; // Fade out trail over time
            }
          }

      // Show trails for "Flash"
      if (this.name === "Flash") {
        noStroke();
        for (let trail of this.trails) {
          fill(
            this.color.levels[0],
            this.color.levels[1],
            this.color.levels[2],
            trail.alpha
          );
          ellipse(trail.x, trail.y, this.diameter - 3);
        }
      }
  
      if (this.visible && !this.isExploding) {
        if (this.glowColor) {
          fill(this.glowColor);
          ellipse(this.x, this.y, this.diameter + 10);
        }
        fill(this.color);
        ellipse(this.x, this.y, this.diameter);
        noStroke();
        if (this.messageTimer > 0) {
          fill(this.dragging ? color(255, 0, 0) : this.color);
          text(this.message, this.x, this.y - 50);
        }
      }
    }

    displayMessage() {
        if (this.messageTimer > 0 && this.visible) {
          fill(this.dragging ? color(255, 0, 0) : this.color);
          text(this.message, this.x, this.y - 50);
        }
      }
      
    pressed() {
      let d = dist(mouseX, mouseY, this.x, this.y);
      if (d < this.diameter / 2 && activeWanderer == null) {
        this.dragging = true;
        activeWanderer = this;
        this.offsetX = this.x - mouseX;
        this.offsetY = this.y - mouseY;
        this.initialMouseX = mouseX;
        this.initialMouseY = mouseY;
        this.initialTime = millis();
      }
    }
    released() {
      if (this.dragging) {
        let timeDelta = millis() - this.initialTime;
        if (timeDelta > 0) {
          this.xVelocity = ((mouseX - this.initialMouseX) / timeDelta) * 100;
          this.yVelocity = ((mouseY - this.initialMouseY) / timeDelta) * 100;
        }
        this.dragging = false;
        activeWanderer = null;
        this.draggingMessage = false;
        this.holdTimer = 0;
        if (isWandererInZone(this, inspectionZone)) {
          showInspectionPopup(this.isRare, this.name);
        }
      }
    }
    boundaryCollision() {
      if (this.x > width - this.diameter / 2 || this.x < this.diameter / 2) {
        this.xVelocity *= -this.bounce;
        this.x = constrain(this.x, this.diameter / 2, width - this.diameter / 2);
        if (Math.abs(this.xVelocity) < 1) {
          this.xVelocity = this.x < width / 2 ? 2 : -2; // Ensure it moves away from the side
        }
      }
      if (this.y >= groundLevel - this.diameter / 2) {
        this.y = groundLevel - this.diameter / 2;
        this.yVelocity *= -this.bounce;
        if (Math.abs(this.yVelocity) < 1) {
          this.yVelocity = -2; // Ensure it moves away from the ground
        }
      } else if (this.y < this.diameter / 2) {
        this.yVelocity *= -this.bounce;
        this.y = this.diameter / 2;
        if (Math.abs(this.yVelocity) < 1) {
          this.yVelocity = 2; // Ensure it moves away from the top
        }
      }
    }
    addTrail() {
      this.trails.push({ x: this.x, y: this.y, alpha: 255 });
      if (this.trails.length > 15) {
        this.trails.shift();
      }
    }
    updateTrails() {
      for (let trail of this.trails) {
        trail.alpha -= 40; // Fade out trail over time
      }
      this.trails = this.trails.filter((trail) => trail.alpha > 0); // Remove faded trails
    }
    freeze() {
        this.frozen = true;
        this.freezeTimer = 300; // Freeze for 5 seconds (300 frames at 60 FPS)
        this.color = color(186, 242, 239); // Change color to blue
        this.xVelocity = 0;
        this.yVelocity = -10; // Apply upward velocity for the jump effect
      }

      ignite() {
        this.ignited = true;
        this.igniteTimer = 180; // Ignite for 3 seconds (180 frames at 60 FPS)
        this.color = color(255, 0, 0); // Change color to red
        this.bounce = 1.2; // Increase bounce factor
        this.igniteMessages = ['OW OW OW']; // Ignite messages
        this.message = random(this.igniteMessages); // Set one of the ignite messages
        this.yVelocity = -10; // Apply upward velocity for the jump effect
      }
      

      addIgniteTrail() {
        this.igniteTrail.push({ x: this.x, y: this.y, alpha: 255 });
        if (this.igniteTrail.length > 15) {
          this.igniteTrail.shift();
        }
      }

      brightenOtherWanderers() {
        const brightenDuration = 180; // Duration in frames (3 seconds at 60 FPS)
        wanderers.forEach((other) => {
          if (other !== this) {
            let d = dist(this.x, this.y, other.x, other.y);
            let collisionDist = this.diameter / 2 + other.diameter / 2;
            if (d < collisionDist) {
              other.color = color(186, 255, 255); // Bright yellow color
              other.brightenTimer = brightenDuration; // Set timer for the bright color
            }
          }
        });
      }      
      
  }
  
  class Particle {
    constructor(
      x,
      y,
      color,
      minSize = 355,
      maxSize = 500,
      minSpeed = 1,
      maxSpeed = 15,
      fastFade = false
    ) {
      this.x = x;
      this.y = y;
      this.xVelocity = random(-maxSpeed, maxSpeed);
      this.yVelocity = random(-maxSpeed, maxSpeed);
      this.size = random(minSize, maxSize);
      this.opacity = 255;
      this.color = color;
      this.fadeSpeed = fastFade ? 2 : 0.5; // Faster fade if fastFade is true
    }
    update() {
      this.x += this.xVelocity;
      this.y += this.yVelocity;
      this.size -= 0.1;
      this.opacity -= this.fadeSpeed; // Use fadeSpeed for opacity reduction
    }
    show() {
      noStroke();
      fill(
        this.color.levels[0],
        this.color.levels[1],
        this.color.levels[2],
        this.opacity
      );
      ellipse(this.x, this.y, this.size);
    }
    isDone() {
      return this.opacity <= 0 || this.size <= 0;
    }
  }
  
  function mousePressed() {
    wanderers.forEach((wanderer) => wanderer.pressed());
  }
  function mouseReleased() {
    if (activeWanderer) {
      activeWanderer.released();
    }
  }
  function touchStarted() {
    wanderers.forEach((wanderer) => wanderer.pressed());
  }
  function touchEnded() {
    if (activeWanderer) {
      activeWanderer.released();
    }
  }
  
  function expandInfoWindow(event) {
    const infoWindow = document.getElementById("infoWindow");
    infoWindow.classList.toggle("expanded");
    event.stopPropagation();
  }
  
  function startDrag(event) {
    const infoWindow = document.getElementById("infoWindow");
    isDragging = true;
    dragOffsetX = event.clientX - infoWindow.getBoundingClientRect().left;
    dragOffsetY = event.clientY - infoWindow.getBoundingClientRect().top;
  }
  
  function startDragTouch(event) {
    const infoWindow = document.getElementById("infoWindow");
    isDragging = true;
    const touch = event.touches[0];
    dragOffsetX = touch.clientX - infoWindow.getBoundingClientRect().left;
    dragOffsetY = touch.clientY - infoWindow.getBoundingClientRect().top;
  }
  
  function doDrag(event) {
    if (isDragging) {
      const infoWindow = document.getElementById("infoWindow");
      infoWindow.style.left = `${event.clientX - dragOffsetX}px`;
      infoWindow.style.top = `${event.clientY - dragOffsetY}px`;
    }
  }
  
  function doDragTouch(event) {
    if (isDragging) {
      const infoWindow = document.getElementById("infoWindow");
      const touch = event.touches[0];
      infoWindow.style.left = `${touch.clientX - dragOffsetX}px`;
      infoWindow.style.top = `${touch.clientY - dragOffsetY}px`;
    }
  }
  
  function stopDrag() {
    isDragging = false;
  }
  
  function isWandererInZone(wanderer, zone) {
    const rect = zone.getBoundingClientRect();
    return (
      wanderer.x >= rect.left &&
      wanderer.x <= rect.right &&
      wanderer.y >= rect.top &&
      wanderer.y <= rect.bottom
    );
  }
  
  function showInspectionPopup(isRare, name) {
    clearTimeout(popupTimeout);
    if (isRare) {
      let popupId = `popup-${name.toLowerCase()}`;
      let popup = document.getElementById(popupId);
      popup.style.display = "flex";
    } else {
      const popup = document.getElementById("popup");
      document.getElementById("popup-message").textContent =
        "This is a common Wanderer!";
      popup.style.display = "flex";
      popupTimeout = setTimeout(closePopup, 3000);
    }
  }
  
  function onInspectionZoneHover() {
    if (activeWanderer) {
      inspectionZone.classList.add("holding-wanderer");
    }
  }
  
  function onInspectionZoneLeave() {
    inspectionZone.classList.remove("holding-wanderer");
  }
  