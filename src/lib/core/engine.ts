import { updateResources } from './systems/resourceSystem';
import { updateUpgradeVisibility } from './systems/upgradeSystem';
import { loadGameDefinitions } from './managers/loaders';

let isGameLoopRunning = false;
let animationFrameId: number | null = null;

export async function initializeGame() {
    // Don't start another loop if one is already running
    if (isGameLoopRunning) {
        console.warn('Game loop is already running. Stopping previous loop.');
        stopGameLoop();
    }

    await loadGameDefinitions();
    startGameLoop();
}

function startGameLoop() {
    let lastUpdate = performance.now();
    let accumulator = 0;
    const FIXED_TIMESTEP = 1000 / 60; // 60 FPS in milliseconds
    
    isGameLoopRunning = true;
    
    function gameLoop() {
        if (!isGameLoopRunning) return;

        const now = performance.now();
        let frameTime = now - lastUpdate;
        lastUpdate = now;
        
        // Prevent spiral of death if browser tab was inactive
        if (frameTime > 1000) {
            frameTime = FIXED_TIMESTEP;
        }
        
        accumulator += frameTime;
        
        while (accumulator >= FIXED_TIMESTEP) {
            updateResources(FIXED_TIMESTEP / 1000);
            updateUpgradeVisibility();
            accumulator -= FIXED_TIMESTEP;
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

export function stopGameLoop() {
    isGameLoopRunning = false;
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}