/* eslint-disable no-undef */
let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @param {SqrtPrice} current_sqrt_price
* @param {SqrtPrice} target_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} by_amount_in
* @param {Percentage} fee
* @returns {SwapResult}
*/
export function computeSwapStep(current_sqrt_price, target_sqrt_price, liquidity, amount, by_amount_in, fee) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.computeSwapStep(retptr, addHeapObject(current_sqrt_price), addHeapObject(target_sqrt_price), addHeapObject(liquidity), addHeapObject(amount), by_amount_in, addHeapObject(fee));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} sqrt_price_a
* @param {SqrtPrice} sqrt_price_b
* @param {Liquidity} liquidity
* @param {boolean} rounding_up
* @returns {TokenAmount}
*/
export function getDeltaX(sqrt_price_a, sqrt_price_b, liquidity, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getDeltaX(retptr, addHeapObject(sqrt_price_a), addHeapObject(sqrt_price_b), addHeapObject(liquidity), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} sqrt_price_a
* @param {SqrtPrice} sqrt_price_b
* @param {Liquidity} liquidity
* @param {boolean} rounding_up
* @returns {TokenAmount}
*/
export function getDeltaY(sqrt_price_a, sqrt_price_b, liquidity, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getDeltaY(retptr, addHeapObject(sqrt_price_a), addHeapObject(sqrt_price_b), addHeapObject(liquidity), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} x_to_y
* @returns {SqrtPrice}
*/
export function getNextSqrtPriceFromInput(starting_sqrt_price, liquidity, amount, x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceFromInput(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(amount), x_to_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} amount
* @param {boolean} x_to_y
* @returns {SqrtPrice}
*/
export function getNextSqrtPriceFromOutput(starting_sqrt_price, liquidity, amount, x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceFromOutput(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(amount), x_to_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} x
* @param {boolean} add_x
* @returns {SqrtPrice}
*/
export function getNextSqrtPriceXUp(starting_sqrt_price, liquidity, x, add_x) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceXUp(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(x), add_x);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {TokenAmount} y
* @param {boolean} add_y
* @returns {SqrtPrice}
*/
export function getNextSqrtPriceYDown(starting_sqrt_price, liquidity, y, add_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getNextSqrtPriceYDown(retptr, addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(y), add_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} current_tick_index
* @param {SqrtPrice} current_sqrt_price
* @param {Liquidity} liquidity_delta
* @param {boolean} liquidity_sign
* @param {number} upper_tick
* @param {number} lower_tick
* @returns {AmountDeltaResult}
*/
export function calculateAmountDelta(current_tick_index, current_sqrt_price, liquidity_delta, liquidity_sign, upper_tick, lower_tick) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateAmountDelta(retptr, current_tick_index, addHeapObject(current_sqrt_price), addHeapObject(liquidity_delta), liquidity_sign, upper_tick, lower_tick);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} amount
* @param {SqrtPrice} starting_sqrt_price
* @param {Liquidity} liquidity
* @param {Percentage} fee
* @param {boolean} by_amount_in
* @param {boolean} x_to_y
* @returns {boolean}
*/
export function isEnoughAmountToChangePrice(amount, starting_sqrt_price, liquidity, fee, by_amount_in, x_to_y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isEnoughAmountToChangePrice(retptr, addHeapObject(amount), addHeapObject(starting_sqrt_price), addHeapObject(liquidity), addHeapObject(fee), by_amount_in, x_to_y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_spacing
* @returns {Liquidity}
*/
export function calculateMaxLiquidityPerTick(tick_spacing) {
    const ret = wasm.calculateMaxLiquidityPerTick(tick_spacing);
    return takeObject(ret);
}

/**
* @param {number} tick_lower
* @param {number} tick_upper
* @param {number} tick_spacing
*/
export function checkTicks(tick_lower, tick_upper, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.checkTicks(retptr, tick_lower, tick_upper, tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_index
* @param {number} tick_spacing
*/
export function checkTick(tick_index, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.checkTick(retptr, tick_index, tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} expected_amount_out
* @param {Percentage} slippage
* @returns {TokenAmount}
*/
export function calculateMinAmountOut(expected_amount_out, slippage) {
    const ret = wasm.calculateMinAmountOut(addHeapObject(expected_amount_out), addHeapObject(slippage));
    return takeObject(ret);
}

/**
* @param {number} tick
* @param {number} tick_spacing
* @returns {PositionResult}
*/
export function tickToPositionJs(tick, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tickToPositionJs(retptr, tick, tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} chunk
* @param {number} bit
* @param {number} tick_spacing
* @returns {number}
*/
export function positionToTick(chunk, bit, tick_spacing) {
    const ret = wasm.positionToTick(chunk, bit, tick_spacing);
    return ret;
}

/**
* @returns {bigint}
*/
export function getGlobalMaxSqrtPrice() {
    const ret = wasm.getGlobalMaxSqrtPrice();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getGlobalMinSqrtPrice() {
    const ret = wasm.getGlobalMinSqrtPrice();
    return takeObject(ret);
}

/**
* @returns {number}
*/
export function getTickSearchRange() {
    const ret = wasm.getTickSearchRange();
    return ret;
}

/**
* @param {number} tick_spacing
* @returns {number}
*/
export function getMaxChunk(tick_spacing) {
    const ret = wasm.getMaxChunk(tick_spacing);
    return ret;
}

/**
* @returns {number}
*/
export function getChunkSize() {
    const ret = wasm.getChunkSize();
    return ret;
}

/**
* @returns {number}
*/
export function getMaxTickCross() {
    const ret = wasm.getMaxTickCross();
    return ret;
}

/**
* @returns {number}
*/
export function getMaxTickmapQuerySize() {
    const ret = wasm.getMaxTickmapQuerySize();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function getLiquidityTicksLimit() {
    const ret = wasm.getLiquidityTicksLimit();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function getMaxPoolKeysReturned() {
    const ret = wasm.getMaxPoolKeysReturned();
    return ret;
}

/**
* @returns {number}
*/
export function getMaxPoolPairsReturned() {
    const ret = wasm.getMaxPoolPairsReturned();
    return ret >>> 0;
}

/**
* @param {number} lower_tick_index
* @param {FeeGrowth} lower_tick_fee_growth_outside_x
* @param {FeeGrowth} lower_tick_fee_growth_outside_y
* @param {number} upper_tick_index
* @param {FeeGrowth} upper_tick_fee_growth_outside_x
* @param {FeeGrowth} upper_tick_fee_growth_outside_y
* @param {number} pool_current_tick_index
* @param {FeeGrowth} pool_fee_growth_global_x
* @param {FeeGrowth} pool_fee_growth_global_y
* @param {FeeGrowth} position_fee_growth_inside_x
* @param {FeeGrowth} position_fee_growth_inside_y
* @param {Liquidity} position_liquidity
* @returns {TokenAmounts}
*/
export function calculateFee(lower_tick_index, lower_tick_fee_growth_outside_x, lower_tick_fee_growth_outside_y, upper_tick_index, upper_tick_fee_growth_outside_x, upper_tick_fee_growth_outside_y, pool_current_tick_index, pool_fee_growth_global_x, pool_fee_growth_global_y, position_fee_growth_inside_x, position_fee_growth_inside_y, position_liquidity) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateFee(retptr, lower_tick_index, addHeapObject(lower_tick_fee_growth_outside_x), addHeapObject(lower_tick_fee_growth_outside_y), upper_tick_index, addHeapObject(upper_tick_fee_growth_outside_x), addHeapObject(upper_tick_fee_growth_outside_y), pool_current_tick_index, addHeapObject(pool_fee_growth_global_x), addHeapObject(pool_fee_growth_global_y), addHeapObject(position_fee_growth_inside_x), addHeapObject(position_fee_growth_inside_y), addHeapObject(position_liquidity));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} token_candidate
* @param {string} token_to_compare
* @returns {boolean}
*/
export function isTokenX(token_candidate, token_to_compare) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(token_candidate, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(token_to_compare, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.isTokenX(retptr, ptr0, len0, ptr1, len1);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_index
* @param {number} tick_spacing
* @param {SqrtPrice} sqrt_price
* @returns {boolean}
*/
export function checkTickToSqrtPriceRelationship(tick_index, tick_spacing, sqrt_price) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.checkTickToSqrtPriceRelationship(retptr, tick_index, tick_spacing, addHeapObject(sqrt_price));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} accurate_tick
* @param {number} tick_spacing
* @returns {number}
*/
export function alignTickToSpacing(accurate_tick, tick_spacing) {
    const ret = wasm.alignTickToSpacing(accurate_tick, tick_spacing);
    return ret;
}

/**
* @param {SqrtPrice} sqrt_price
* @param {number} tick_spacing
* @returns {number}
*/
export function getTickAtSqrtPrice(sqrt_price, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getTickAtSqrtPrice(retptr, addHeapObject(sqrt_price), tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} x
* @param {number} lower_tick
* @param {number} upper_tick
* @param {SqrtPrice} current_sqrt_price
* @param {boolean} rounding_up
* @returns {SingleTokenLiquidity}
*/
export function getLiquidityByX(x, lower_tick, upper_tick, current_sqrt_price, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getLiquidityByX(retptr, addHeapObject(x), lower_tick, upper_tick, addHeapObject(current_sqrt_price), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {TokenAmount} y
* @param {number} lower_tick
* @param {number} upper_tick
* @param {SqrtPrice} current_sqrt_price
* @param {boolean} rounding_up
* @returns {SingleTokenLiquidity}
*/
export function getLiquidityByY(y, lower_tick, upper_tick, current_sqrt_price, rounding_up) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getLiquidityByY(retptr, addHeapObject(y), lower_tick, upper_tick, addHeapObject(current_sqrt_price), rounding_up);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {Percentage} fee
* @param {number} tick_spacing
* @returns {FeeTier}
*/
export function newFeeTier(fee, tick_spacing) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.newFeeTier(retptr, addHeapObject(fee), tick_spacing);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} token_0
* @param {string} token_1
* @param {FeeTier} fee_tier
* @returns {PoolKey}
*/
export function newPoolKey(token_0, token_1, fee_tier) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(token_0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(token_1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.newPoolKey(retptr, ptr0, len0, ptr1, len1, addHeapObject(fee_tier));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {Tickmap} tickmap
* @param {FeeTier} fee_tier
* @param {Pool} pool
* @param {LiquidityTickVec} ticks
* @param {boolean} x_to_y
* @param {TokenAmount} amount
* @param {boolean} by_amount_in
* @param {SqrtPrice} sqrt_price_limit
* @returns {CalculateSwapResult}
*/
export function simulateSwap(tickmap, fee_tier, pool, ticks, x_to_y, amount, by_amount_in, sqrt_price_limit) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.simulateSwap(retptr, addHeapObject(tickmap), addHeapObject(fee_tier), addHeapObject(pool), addHeapObject(ticks), x_to_y, addHeapObject(amount), by_amount_in, addHeapObject(sqrt_price_limit));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @returns {bigint}
*/
export function getFeeGrowthScale() {
    const ret = wasm.getFeeGrowthScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getFeeGrowthDenominator() {
    const ret = wasm.getFeeGrowthDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toFeeGrowth(integer, scale) {
    const ret = wasm.toFeeGrowth(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getFixedPointScale() {
    const ret = wasm.getFixedPointScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getFixedPointDenominator() {
    const ret = wasm.getFixedPointDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toFixedPoint(integer, scale) {
    const ret = wasm.toFixedPoint(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getLiquidityScale() {
    const ret = wasm.getLiquidityScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getLiquidityDenominator() {
    const ret = wasm.getLiquidityDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toLiquidity(integer, scale) {
    const ret = wasm.toLiquidity(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getPercentageScale() {
    const ret = wasm.getFixedPointScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getPercentageDenominator() {
    const ret = wasm.getPercentageDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toPercentage(integer, scale) {
    const ret = wasm.toPercentage(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getPriceScale() {
    const ret = wasm.getPriceScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getPriceDenominator() {
    const ret = wasm.getPriceDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toPrice(integer, scale) {
    const ret = wasm.toPrice(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getSecondsPerLiquidityScale() {
    const ret = wasm.getPriceScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getSecondsPerLiquidityDenominator() {
    const ret = wasm.getPriceDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toSecondsPerLiquidity(integer, scale) {
    const ret = wasm.toSecondsPerLiquidity(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getSqrtPriceScale() {
    const ret = wasm.getPriceScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getSqrtPriceDenominator() {
    const ret = wasm.getPriceDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toSqrtPrice(integer, scale) {
    const ret = wasm.toSqrtPrice(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

/**
* @param {number} tick_index
* @returns {SqrtPrice}
*/
export function calculateSqrtPrice(tick_index) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateSqrtPrice(retptr, tick_index);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} tick_spacing
* @returns {number}
*/
export function getMaxTick(tick_spacing) {
    const ret = wasm.getMaxTick(tick_spacing);
    return ret;
}

/**
* @param {number} tick_spacing
* @returns {number}
*/
export function getMinTick(tick_spacing) {
    const ret = wasm.getMinTick(tick_spacing);
    return ret;
}

/**
* @param {number} tick_spacing
* @returns {SqrtPrice}
*/
export function getMaxSqrtPrice(tick_spacing) {
    const ret = wasm.getMaxSqrtPrice(tick_spacing);
    return takeObject(ret);
}

/**
* @param {number} tick_spacing
* @returns {SqrtPrice}
*/
export function getMinSqrtPrice(tick_spacing) {
    const ret = wasm.getMinSqrtPrice(tick_spacing);
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getTokenAmountScale() {
    const ret = wasm.getTokenAmountScale();
    return takeObject(ret);
}

/**
* @returns {bigint}
*/
export function getTokenAmountDenominator() {
    const ret = wasm.getTokenAmountDenominator();
    return takeObject(ret);
}

/**
* @param {bigint} integer
* @param {number | undefined} [scale]
* @returns {bigint}
*/
export function toTokenAmount(integer, scale) {
    const ret = wasm.toTokenAmount(integer, isLikeNone(scale) ? 0xFFFFFF : scale);
    return takeObject(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export const SwapError = Object.freeze({ NotAdmin:0,"0":"NotAdmin",NotFeeReceiver:1,"1":"NotFeeReceiver",PoolAlreadyExist:2,"2":"PoolAlreadyExist",PoolNotFound:3,"3":"PoolNotFound",TickAlreadyExist:4,"4":"TickAlreadyExist",InvalidTickIndexOrTickSpacing:5,"5":"InvalidTickIndexOrTickSpacing",PositionNotFound:6,"6":"PositionNotFound",TickNotFound:7,"7":"TickNotFound",FeeTierNotFound:8,"8":"FeeTierNotFound",PoolKeyNotFound:9,"9":"PoolKeyNotFound",AmountIsZero:10,"10":"AmountIsZero",WrongLimit:11,"11":"WrongLimit",PriceLimitReached:12,"12":"PriceLimitReached",NoGainSwap:13,"13":"NoGainSwap",InvalidTickSpacing:14,"14":"InvalidTickSpacing",FeeTierAlreadyExist:15,"15":"FeeTierAlreadyExist",PoolKeyAlreadyExist:16,"16":"PoolKeyAlreadyExist",UnauthorizedFeeReceiver:17,"17":"UnauthorizedFeeReceiver",ZeroLiquidity:18,"18":"ZeroLiquidity",TransferError:19,"19":"TransferError",TokensAreSame:20,"20":"TokensAreSame",AmountUnderMinimumAmountOut:21,"21":"AmountUnderMinimumAmountOut",InvalidFee:22,"22":"InvalidFee",NotEmptyTickDeinitialization:23,"23":"NotEmptyTickDeinitialization",InvalidInitTick:24,"24":"InvalidInitTick",InvalidInitSqrtPrice:25,"25":"InvalidInitSqrtPrice",TickLimitReached:26,"26":"TickLimitReached",NoRouteFound:27,"27":"NoRouteFound",MaxTicksCrossed:28,"28":"MaxTicksCrossed",StateOutdated:29,"29":"StateOutdated",InsufficientLiquidity:30,"30":"InsufficientLiquidity", });

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_bigint_from_u128 = function(arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_BigInt_42b692c18e1ac6d6 = function(arg0) {
        const ret = BigInt(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_parse_66d1801634e099ac = function() { return handleError(function (arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_stringify_8887fe74e1c50d81 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('oraiswap_v3_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
