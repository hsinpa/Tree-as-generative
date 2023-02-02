var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = /* @__PURE__ */ (() => "body { \r\n  margin: 0; \r\n  padding: 0\r\n}\r\n\r\n#canvas_board {\r\n  height: 100vh; \r\n  width: 100vw; \r\n  display: block;\r\n  overflow: hidden\r\n}")();
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
function create() {
  var out = new ARRAY_TYPE(2);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }
  return out;
}
function fromValues(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
function copy$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return Math.hypot(x, y);
}
function normalize(out, a) {
  var x = a[0], y = a[1];
  var len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
function lerp(out, a, b, t) {
  var ax = a[0], ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
(function() {
  var vec = create();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 2;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }
    return a;
  };
})();
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
const Clamp = function(taget, max, min) {
  return Math.min(Math.max(taget, min), max);
};
function NormalizeToBase(value, min, max) {
  return (value - min) / (max - min);
}
function GetImagePromise(imagePath) {
  return new Promise((resolve) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.src = imagePath;
    im.onload = () => resolve(Object.assign(im));
    return im;
  });
}
const thickness_modifier = 0.6;
class SC_Branch {
  constructor(p_postion, p_parent) {
    __publicField(this, "id");
    __publicField(this, "position");
    __publicField(this, "direction");
    __publicField(this, "original_direction");
    __publicField(this, "parent");
    __publicField(this, "count", 0);
    __publicField(this, "candidate_count", 0);
    __publicField(this, "max_candidate", 15);
    __publicField(this, "child_count", 1);
    __publicField(this, "branch_type");
    this.id = v4();
    this.position = p_postion;
    this.parent = p_parent;
    this.direction = create();
    this.original_direction = create();
    if (this.parent != null) {
      subtract(this.direction, this.position, this.parent.position);
      normalize(this.direction, this.direction);
      this.set_direction(this.direction, true);
    }
  }
  get thickness() {
    let thickness = this.child_count * thickness_modifier;
    thickness = Clamp(thickness, thickness, 5);
    return thickness;
  }
  reset() {
    this.direction = copy$1(this.direction, this.original_direction);
    this.count = 0;
  }
  set_direction(p_direction, p_replace_origin = false) {
    this.direction = p_direction;
    if (p_replace_origin) {
      copy$1(this.original_direction, this.direction);
    }
  }
  next() {
    let next_vector = scale(create(), this.direction, 20);
    let next_position = add$1(create(), this.position, next_vector);
    return new SC_Branch(next_position, this);
  }
  set_branch_type(thickness) {
    this.branch_type = { value: 1, type: 2 };
    const buffer = 0.5;
    this.set_branch_helper(thickness, 15, buffer, 1);
    this.set_branch_helper(thickness, 3, buffer, 0);
  }
  set_branch_helper(thickness, threshold, buffer, enumType) {
    if (thickness < threshold) {
      let lower_threshold = threshold - buffer;
      this.branch_type.type = enumType;
      if (thickness > lower_threshold) {
        this.branch_type.value = NormalizeToBase(thickness, lower_threshold, threshold);
      }
      return;
    }
  }
}
function sortKD(ids, coords, nodeSize, left, right, depth) {
  if (right - left <= nodeSize)
    return;
  const m = left + right >> 1;
  select(ids, coords, m, left, right, depth % 2);
  sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
  sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
}
function select(ids, coords, k, left, right, inc) {
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp(2 * z / 3);
      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      select(ids, coords, k, newLeft, newRight, inc);
    }
    const t = coords[2 * k + inc];
    let i = left;
    let j = right;
    swapItem(ids, coords, left, k);
    if (coords[2 * right + inc] > t)
      swapItem(ids, coords, left, right);
    while (i < j) {
      swapItem(ids, coords, i, j);
      i++;
      j--;
      while (coords[2 * i + inc] < t)
        i++;
      while (coords[2 * j + inc] > t)
        j--;
    }
    if (coords[2 * left + inc] === t)
      swapItem(ids, coords, left, j);
    else {
      j++;
      swapItem(ids, coords, j, right);
    }
    if (j <= k)
      left = j + 1;
    if (k <= j)
      right = j - 1;
  }
}
function swapItem(ids, coords, i, j) {
  swap$1(ids, i, j);
  swap$1(coords, 2 * i, 2 * j);
  swap$1(coords, 2 * i + 1, 2 * j + 1);
}
function swap$1(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
  const stack = [0, ids.length - 1, 0];
  const result = [];
  let x, y;
  while (stack.length) {
    const axis = stack.pop();
    const right = stack.pop();
    const left = stack.pop();
    if (right - left <= nodeSize) {
      for (let i = left; i <= right; i++) {
        x = coords[2 * i];
        y = coords[2 * i + 1];
        if (x >= minX && x <= maxX && y >= minY && y <= maxY)
          result.push(ids[i]);
      }
      continue;
    }
    const m = Math.floor((left + right) / 2);
    x = coords[2 * m];
    y = coords[2 * m + 1];
    if (x >= minX && x <= maxX && y >= minY && y <= maxY)
      result.push(ids[m]);
    const nextAxis = (axis + 1) % 2;
    if (axis === 0 ? minX <= x : minY <= y) {
      stack.push(left);
      stack.push(m - 1);
      stack.push(nextAxis);
    }
    if (axis === 0 ? maxX >= x : maxY >= y) {
      stack.push(m + 1);
      stack.push(right);
      stack.push(nextAxis);
    }
  }
  return result;
}
function within(ids, coords, qx, qy, r, nodeSize) {
  const stack = [0, ids.length - 1, 0];
  const result = [];
  const r2 = r * r;
  while (stack.length) {
    const axis = stack.pop();
    const right = stack.pop();
    const left = stack.pop();
    if (right - left <= nodeSize) {
      for (let i = left; i <= right; i++) {
        if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2)
          result.push(ids[i]);
      }
      continue;
    }
    const m = Math.floor((left + right) / 2);
    const x = coords[2 * m];
    const y = coords[2 * m + 1];
    if (sqDist(x, y, qx, qy) <= r2)
      result.push(ids[m]);
    const nextAxis = (axis + 1) % 2;
    if (axis === 0 ? qx - r <= x : qy - r <= y) {
      stack.push(left);
      stack.push(m - 1);
      stack.push(nextAxis);
    }
    if (axis === 0 ? qx + r >= x : qy + r >= y) {
      stack.push(m + 1);
      stack.push(right);
      stack.push(nextAxis);
    }
  }
  return result;
}
function sqDist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
const defaultGetX = (p2) => p2[0];
const defaultGetY = (p2) => p2[1];
class KDBush {
  constructor(points, getX = defaultGetX, getY = defaultGetY, nodeSize = 64, ArrayType = Float64Array) {
    this.nodeSize = nodeSize;
    this.points = points;
    const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;
    const ids = this.ids = new IndexArrayType(points.length);
    const coords = this.coords = new ArrayType(points.length * 2);
    for (let i = 0; i < points.length; i++) {
      ids[i] = i;
      coords[2 * i] = getX(points[i]);
      coords[2 * i + 1] = getY(points[i]);
    }
    sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
  }
  range(minX, minY, maxX, maxY) {
    return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
  }
  within(x, y, r) {
    return within(this.ids, this.coords, x, y, r, this.nodeSize);
  }
}
class SpaceColonization {
  constructor(min_distance, max_distance, random_engine) {
    __publicField(this, "m_rand_engine");
    __publicField(this, "m_leaves", []);
    __publicField(this, "m_branches", []);
    __publicField(this, "m_kd_candidates", null);
    __publicField(this, "m_kd_branches", null);
    __publicField(this, "m_kd_endpoints", {});
    __publicField(this, "m_min_distance");
    __publicField(this, "m_max_distance");
    this.m_min_distance = min_distance;
    this.m_max_distance = max_distance;
    this.m_rand_engine = random_engine;
  }
  get Leaves() {
    return this.m_leaves;
  }
  get Branches() {
    return this.m_branches;
  }
  spawn_attractor(rect, spawn_length) {
    this.m_leaves = [];
    for (let i = 0; i < spawn_length; i++) {
      let random_x = this.m_rand_engine.integer(rect.xMin, rect.xMax);
      let random_y = this.m_rand_engine.integer(rect.yMin, rect.yMax);
      let point = fromValues(random_x, random_y);
      this.m_leaves.push({ position: point, reached: false });
    }
    this.m_kd_candidates = new KDBush(this.m_leaves, (n) => n.position[0], (n) => n.position[1], this.m_leaves.length, Float32Array);
  }
  spawn_free_branch(root_x, root_y) {
    this.m_branches = [];
    let root = new SC_Branch(fromValues(root_x, root_y), null);
    root.direction = fromValues(0, -1);
    this.m_branches.push(root);
    let current_branch = root;
    this.m_leaves.length;
    let max_trial = 5e4;
    while (this.m_branches.length < max_trial) {
      if (current_branch == null)
        break;
      let found = false;
      let leave_index = this.m_kd_candidates.within(current_branch.position[0], current_branch.position[1], this.m_max_distance);
      let filter_length = leave_index.length;
      for (let i = 0; i < filter_length; i++) {
        let leave = this.m_leaves[leave_index[i]];
        let distance$1 = distance(current_branch.position, leave.position);
        if (distance$1 < this.m_max_distance) {
          if (!found)
            found = true;
        }
      }
      if (!found) {
        let branch = current_branch.next();
        current_branch = branch;
        this.m_branches.push(branch);
        continue;
      }
      current_branch = null;
    }
    this.m_kd_branches = new KDBush(this.m_branches, (n) => n.position[0], (n) => n.position[1], this.m_leaves.length, Float32Array);
  }
  grow_branch() {
    let leave_lens = this.m_leaves.length;
    let branch_lens = this.m_branches.length;
    for (let i = 0; i < leave_lens; i++) {
      let leaf = this.m_leaves[i];
      let closestBranch = null;
      let record = this.m_max_distance;
      let filter_branches = this.m_kd_branches.within(leaf.position[0], leaf.position[1], this.m_max_distance);
      let filter_length = filter_branches.length;
      for (let j = filter_length - 1; j >= 0; j--) {
        let branch2 = this.m_branches[filter_branches[j]];
        let distance$1 = distance(branch2.position, leaf.position);
        if (distance$1 < this.m_min_distance) {
          leaf.reached = true;
          closestBranch = null;
          break;
        } else if (distance$1 < record && branch2.candidate_count < branch2.max_candidate) {
          closestBranch = branch2;
          record = distance$1;
        }
      }
      if (closestBranch != null) {
        let newDir = subtract(create(), leaf.position, closestBranch.position);
        normalize(newDir, newDir);
        closestBranch.direction = add$1(closestBranch.direction, closestBranch.direction, newDir);
        closestBranch.count++;
        closestBranch.candidate_count++;
      }
    }
    let update_branch = 0;
    for (let i = leave_lens - 1; i >= 0; i--) {
      if (this.m_leaves[i].reached) {
        this.m_leaves.splice(i, 1);
      }
    }
    for (let i = branch_lens - 1; i >= 0; i--) {
      var branch = this.m_branches[i];
      if (branch.count > 0) {
        let average_direction = branch.direction;
        update_branch++;
        scale(average_direction, average_direction, 1 / (branch.count + 1));
        branch.set_direction(average_direction);
        let nextBranch = branch.next();
        this.m_kd_endpoints[nextBranch.id] = nextBranch;
        if (branch.id in this.m_kd_endpoints) {
          delete this.m_kd_endpoints[branch.id];
        }
        this.m_branches.push(nextBranch);
        branch.reset();
      }
    }
    this.m_kd_candidates = new KDBush(this.m_leaves, (n) => n.position[0], (n) => n.position[1], this.m_leaves.length, Float32Array);
    this.m_kd_branches = new KDBush(this.m_branches, (n) => n.position[0], (n) => n.position[1], this.m_branches.length, Float32Array);
    return update_branch;
  }
  calculate_branch_width() {
    let endpointKeys = Object.keys(this.m_kd_endpoints);
    let l = endpointKeys.length;
    for (let i = 0; i < l; i++) {
      let current_branch = this.m_kd_endpoints[endpointKeys[i]];
      current_branch.set_branch_type(current_branch.thickness);
      while (current_branch.parent != null) {
        let parent_branch = current_branch.parent;
        if (parent_branch.child_count <= current_branch.child_count) {
          parent_branch.child_count = current_branch.child_count + 1;
        } else {
          break;
        }
        current_branch = parent_branch;
      }
    }
  }
}
class SimpleCanvas {
  constructor(queryString) {
    __publicField(this, "_canvasDom");
    __publicField(this, "_context");
    __publicField(this, "screenHeight");
    __publicField(this, "screenWidth");
    __publicField(this, "IsProgramValid", false);
    this._canvasDom = document.querySelector(queryString);
    this.IsProgramValid = this._canvasDom != null;
    if (this.IsProgramValid) {
      this._context = this._canvasDom.getContext("2d");
      this.RegisterDomEvent();
      this.SetCanvasSize();
    }
  }
  get ScreenHeight() {
    return this._canvasDom.height;
  }
  get ScreenWidth() {
    return this._canvasDom.width;
  }
  get Context() {
    return this._context;
  }
  RegisterDomEvent() {
    window.addEventListener("resize", () => {
      this.SetCanvasSize();
    });
  }
  SetCanvasSize() {
    this.SetCanvasToSceenSize(this._canvasDom);
  }
  SetCanvasToSceenSize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
class CanvasHelper {
  constructor(context) {
    __publicField(this, "m_ctx");
    this.m_ctx = context;
  }
  DrawRoundRect(roundRect) {
    this.m_ctx.translate(roundRect.x + roundRect.radius, roundRect.y);
    this.m_ctx.rotate(-roundRect.angle);
    this.m_ctx.fillStyle = "green";
    this.m_ctx.fillRect(0, -roundRect.radius, roundRect.length, roundRect.radius * 2);
    this.DrawSphere(0, 0, roundRect.radius);
    this.DrawSphere(roundRect.length, 0, roundRect.radius);
    this.m_ctx.resetTransform();
  }
  DrawSphere(x, y, radius) {
    this.m_ctx.beginPath();
    this.m_ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.m_ctx.closePath();
    this.m_ctx.fill();
  }
  DrawLine(point_a, point_b, thickness) {
    this.m_ctx.lineWidth = thickness;
    let endpoint_color = "orange";
    let thin_branch_color = "green";
    this.m_ctx.strokeStyle = "black";
    if (thickness < 15)
      this.m_ctx.strokeStyle = thin_branch_color;
    if (thickness < 3)
      this.m_ctx.strokeStyle = endpoint_color;
    this.m_ctx.beginPath();
    this.m_ctx.moveTo(point_a[0], point_a[1]);
    this.m_ctx.lineTo(point_b[0], point_b[1]);
    this.m_ctx.stroke();
  }
  DrawImage(texture, position, options) {
    this.m_ctx.resetTransform();
    if (options.translation != null) {
      this.m_ctx.translate(options.translation[0], options.translation[1]);
    }
    if (options.rotation != null) {
      this.m_ctx.rotate(options.rotation);
      this.m_ctx.translate(-options.translation[0], -options.translation[1]);
    }
    this.m_ctx.drawImage(texture, position[0] + options.dx, position[1] + options.dy, texture.width * options.base_scale * options.target_scale, texture.height * options.base_scale * options.target_scale);
    this.m_ctx.resetTransform();
  }
  DrawWire(position, radius, border) {
    let x = position[0];
    let y = position[1];
    this.m_ctx.lineWidth = border;
    this.m_ctx.beginPath();
    this.m_ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.m_ctx.strokeStyle = "blue";
    this.m_ctx.stroke();
    this.m_ctx.lineWidth = 1;
  }
  Clear(width, height) {
    this.m_ctx.clearRect(0, 0, width, height);
  }
}
class Rect {
  constructor(x, y, width, height) {
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "m_width");
    __publicField(this, "m_height");
    __publicField(this, "m_center", create());
    this.x = x;
    this.y = y;
    this.m_width = width;
    this.m_height = height;
  }
  get width() {
    return this.m_width;
  }
  get height() {
    return this.m_height;
  }
  get width_half() {
    return this.m_width * 0, 5;
  }
  get height_half() {
    return this.m_height * 0.5;
  }
  get center() {
    this.m_center[0] = this.x + this.width_half;
    this.m_center[1] = this.y + this.height_half;
    return this.m_center;
  }
  get xMin() {
    return this.x;
  }
  get xMax() {
    return this.x + this.m_width;
  }
  get yMin() {
    return this.y;
  }
  get yMax() {
    return this.y + this.m_height;
  }
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var lib = {};
var arrays$4 = {};
var util$a = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  exports.has = function(obj, prop) {
    return _hasOwnProperty.call(obj, prop);
  };
  function defaultCompare(a, b) {
    if (a < b) {
      return -1;
    } else if (a === b) {
      return 0;
    } else {
      return 1;
    }
  }
  exports.defaultCompare = defaultCompare;
  function defaultEquals(a, b) {
    return a === b;
  }
  exports.defaultEquals = defaultEquals;
  function defaultToString(item) {
    if (item === null) {
      return "COLLECTION_NULL";
    } else if (isUndefined(item)) {
      return "COLLECTION_UNDEFINED";
    } else if (isString(item)) {
      return "$s" + item;
    } else {
      return "$o" + item.toString();
    }
  }
  exports.defaultToString = defaultToString;
  function makeString(item, join) {
    if (join === void 0) {
      join = ",";
    }
    if (item === null) {
      return "COLLECTION_NULL";
    } else if (isUndefined(item)) {
      return "COLLECTION_UNDEFINED";
    } else if (isString(item)) {
      return item.toString();
    } else {
      var toret = "{";
      var first = true;
      for (var prop in item) {
        if (exports.has(item, prop)) {
          if (first) {
            first = false;
          } else {
            toret = toret + join;
          }
          toret = toret + prop + ":" + item[prop];
        }
      }
      return toret + "}";
    }
  }
  exports.makeString = makeString;
  function isFunction(func) {
    return typeof func === "function";
  }
  exports.isFunction = isFunction;
  function isUndefined(obj) {
    return typeof obj === "undefined";
  }
  exports.isUndefined = isUndefined;
  function isString(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
  }
  exports.isString = isString;
  function reverseCompareFunction(compareFunction) {
    if (isUndefined(compareFunction) || !isFunction(compareFunction)) {
      return function(a, b) {
        if (a < b) {
          return 1;
        } else if (a === b) {
          return 0;
        } else {
          return -1;
        }
      };
    } else {
      return function(d, v) {
        return compareFunction(d, v) * -1;
      };
    }
  }
  exports.reverseCompareFunction = reverseCompareFunction;
  function compareToEquals(compareFunction) {
    return function(a, b) {
      return compareFunction(a, b) === 0;
    };
  }
  exports.compareToEquals = compareToEquals;
})(util$a);
Object.defineProperty(arrays$4, "__esModule", { value: true });
var util$9 = util$a;
function indexOf(array, item, equalsFunction) {
  var equals2 = equalsFunction || util$9.defaultEquals;
  var length = array.length;
  for (var i = 0; i < length; i++) {
    if (equals2(array[i], item)) {
      return i;
    }
  }
  return -1;
}
arrays$4.indexOf = indexOf;
function lastIndexOf(array, item, equalsFunction) {
  var equals2 = equalsFunction || util$9.defaultEquals;
  var length = array.length;
  for (var i = length - 1; i >= 0; i--) {
    if (equals2(array[i], item)) {
      return i;
    }
  }
  return -1;
}
arrays$4.lastIndexOf = lastIndexOf;
function contains(array, item, equalsFunction) {
  return indexOf(array, item, equalsFunction) >= 0;
}
arrays$4.contains = contains;
function remove(array, item, equalsFunction) {
  var index = indexOf(array, item, equalsFunction);
  if (index < 0) {
    return false;
  }
  array.splice(index, 1);
  return true;
}
arrays$4.remove = remove;
function frequency(array, item, equalsFunction) {
  var equals2 = equalsFunction || util$9.defaultEquals;
  var length = array.length;
  var freq = 0;
  for (var i = 0; i < length; i++) {
    if (equals2(array[i], item)) {
      freq++;
    }
  }
  return freq;
}
arrays$4.frequency = frequency;
function equals(array1, array2, equalsFunction) {
  var equals2 = equalsFunction || util$9.defaultEquals;
  if (array1.length !== array2.length) {
    return false;
  }
  var length = array1.length;
  for (var i = 0; i < length; i++) {
    if (!equals2(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
}
arrays$4.equals = equals;
function copy(array) {
  return array.concat();
}
arrays$4.copy = copy;
function swap(array, i, j) {
  if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
    return false;
  }
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
  return true;
}
arrays$4.swap = swap;
function toString(array) {
  return "[" + array.toString() + "]";
}
arrays$4.toString = toString;
function forEach(array, callback) {
  for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
    var ele = array_1[_i];
    if (callback(ele) === false) {
      return;
    }
  }
}
arrays$4.forEach = forEach;
var Bag$1 = {};
var Dictionary$2 = {};
Object.defineProperty(Dictionary$2, "__esModule", { value: true });
var util$8 = util$a;
var Dictionary$1 = function() {
  function Dictionary2(toStrFunction) {
    this.table = {};
    this.nElements = 0;
    this.toStr = toStrFunction || util$8.defaultToString;
  }
  Dictionary2.prototype.getValue = function(key) {
    var pair = this.table["$" + this.toStr(key)];
    if (util$8.isUndefined(pair)) {
      return void 0;
    }
    return pair.value;
  };
  Dictionary2.prototype.setValue = function(key, value) {
    if (util$8.isUndefined(key) || util$8.isUndefined(value)) {
      return void 0;
    }
    var ret;
    var k = "$" + this.toStr(key);
    var previousElement = this.table[k];
    if (util$8.isUndefined(previousElement)) {
      this.nElements++;
      ret = void 0;
    } else {
      ret = previousElement.value;
    }
    this.table[k] = {
      key,
      value
    };
    return ret;
  };
  Dictionary2.prototype.remove = function(key) {
    var k = "$" + this.toStr(key);
    var previousElement = this.table[k];
    if (!util$8.isUndefined(previousElement)) {
      delete this.table[k];
      this.nElements--;
      return previousElement.value;
    }
    return void 0;
  };
  Dictionary2.prototype.keys = function() {
    var array = [];
    for (var name_1 in this.table) {
      if (util$8.has(this.table, name_1)) {
        var pair = this.table[name_1];
        array.push(pair.key);
      }
    }
    return array;
  };
  Dictionary2.prototype.values = function() {
    var array = [];
    for (var name_2 in this.table) {
      if (util$8.has(this.table, name_2)) {
        var pair = this.table[name_2];
        array.push(pair.value);
      }
    }
    return array;
  };
  Dictionary2.prototype.forEach = function(callback) {
    for (var name_3 in this.table) {
      if (util$8.has(this.table, name_3)) {
        var pair = this.table[name_3];
        var ret = callback(pair.key, pair.value);
        if (ret === false) {
          return;
        }
      }
    }
  };
  Dictionary2.prototype.containsKey = function(key) {
    return !util$8.isUndefined(this.getValue(key));
  };
  Dictionary2.prototype.clear = function() {
    this.table = {};
    this.nElements = 0;
  };
  Dictionary2.prototype.size = function() {
    return this.nElements;
  };
  Dictionary2.prototype.isEmpty = function() {
    return this.nElements <= 0;
  };
  Dictionary2.prototype.toString = function() {
    var toret = "{";
    this.forEach(function(k, v) {
      toret += "\n	" + k + " : " + v;
    });
    return toret + "\n}";
  };
  return Dictionary2;
}();
Dictionary$2.default = Dictionary$1;
var _Set = {};
Object.defineProperty(_Set, "__esModule", { value: true });
var util$7 = util$a;
var arrays$3 = arrays$4;
var Dictionary_1$5 = Dictionary$2;
var Set = function() {
  function Set2(toStringFunction) {
    this.dictionary = new Dictionary_1$5.default(toStringFunction);
  }
  Set2.prototype.contains = function(element) {
    return this.dictionary.containsKey(element);
  };
  Set2.prototype.add = function(element) {
    if (this.contains(element) || util$7.isUndefined(element)) {
      return false;
    } else {
      this.dictionary.setValue(element, element);
      return true;
    }
  };
  Set2.prototype.intersection = function(otherSet) {
    var set = this;
    this.forEach(function(element) {
      if (!otherSet.contains(element)) {
        set.remove(element);
      }
      return true;
    });
  };
  Set2.prototype.union = function(otherSet) {
    var set = this;
    otherSet.forEach(function(element) {
      set.add(element);
      return true;
    });
  };
  Set2.prototype.difference = function(otherSet) {
    var set = this;
    otherSet.forEach(function(element) {
      set.remove(element);
      return true;
    });
  };
  Set2.prototype.isSubsetOf = function(otherSet) {
    if (this.size() > otherSet.size()) {
      return false;
    }
    var isSub = true;
    this.forEach(function(element) {
      if (!otherSet.contains(element)) {
        isSub = false;
        return false;
      }
      return true;
    });
    return isSub;
  };
  Set2.prototype.remove = function(element) {
    if (!this.contains(element)) {
      return false;
    } else {
      this.dictionary.remove(element);
      return true;
    }
  };
  Set2.prototype.forEach = function(callback) {
    this.dictionary.forEach(function(k, v) {
      return callback(v);
    });
  };
  Set2.prototype.toArray = function() {
    return this.dictionary.values();
  };
  Set2.prototype.isEmpty = function() {
    return this.dictionary.isEmpty();
  };
  Set2.prototype.size = function() {
    return this.dictionary.size();
  };
  Set2.prototype.clear = function() {
    this.dictionary.clear();
  };
  Set2.prototype.toString = function() {
    return arrays$3.toString(this.toArray());
  };
  return Set2;
}();
_Set.default = Set;
Object.defineProperty(Bag$1, "__esModule", { value: true });
var util$6 = util$a;
var Dictionary_1$4 = Dictionary$2;
var Set_1$1 = _Set;
var Bag = function() {
  function Bag2(toStrFunction) {
    this.toStrF = toStrFunction || util$6.defaultToString;
    this.dictionary = new Dictionary_1$4.default(this.toStrF);
    this.nElements = 0;
  }
  Bag2.prototype.add = function(element, nCopies) {
    if (nCopies === void 0) {
      nCopies = 1;
    }
    if (util$6.isUndefined(element) || nCopies <= 0) {
      return false;
    }
    if (!this.contains(element)) {
      var node = {
        value: element,
        copies: nCopies
      };
      this.dictionary.setValue(element, node);
    } else {
      this.dictionary.getValue(element).copies += nCopies;
    }
    this.nElements += nCopies;
    return true;
  };
  Bag2.prototype.count = function(element) {
    if (!this.contains(element)) {
      return 0;
    } else {
      return this.dictionary.getValue(element).copies;
    }
  };
  Bag2.prototype.contains = function(element) {
    return this.dictionary.containsKey(element);
  };
  Bag2.prototype.remove = function(element, nCopies) {
    if (nCopies === void 0) {
      nCopies = 1;
    }
    if (util$6.isUndefined(element) || nCopies <= 0) {
      return false;
    }
    if (!this.contains(element)) {
      return false;
    } else {
      var node = this.dictionary.getValue(element);
      if (nCopies > node.copies) {
        this.nElements -= node.copies;
      } else {
        this.nElements -= nCopies;
      }
      node.copies -= nCopies;
      if (node.copies <= 0) {
        this.dictionary.remove(element);
      }
      return true;
    }
  };
  Bag2.prototype.toArray = function() {
    var a = [];
    var values = this.dictionary.values();
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
      var node = values_1[_i];
      var element = node.value;
      var copies = node.copies;
      for (var j = 0; j < copies; j++) {
        a.push(element);
      }
    }
    return a;
  };
  Bag2.prototype.toSet = function() {
    var toret = new Set_1$1.default(this.toStrF);
    var elements = this.dictionary.values();
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
      var ele = elements_1[_i];
      var value = ele.value;
      toret.add(value);
    }
    return toret;
  };
  Bag2.prototype.forEach = function(callback) {
    this.dictionary.forEach(function(k, v) {
      var value = v.value;
      var copies = v.copies;
      for (var i = 0; i < copies; i++) {
        if (callback(value) === false) {
          return false;
        }
      }
      return true;
    });
  };
  Bag2.prototype.size = function() {
    return this.nElements;
  };
  Bag2.prototype.isEmpty = function() {
    return this.nElements === 0;
  };
  Bag2.prototype.clear = function() {
    this.nElements = 0;
    this.dictionary.clear();
  };
  return Bag2;
}();
Bag$1.default = Bag;
var BSTree$1 = {};
var BSTreeKV$1 = {};
var Queue$1 = {};
var LinkedList$1 = {};
Object.defineProperty(LinkedList$1, "__esModule", { value: true });
var util$5 = util$a;
var arrays$2 = arrays$4;
var LinkedList = function() {
  function LinkedList2() {
    this.firstNode = null;
    this.lastNode = null;
    this.nElements = 0;
  }
  LinkedList2.prototype.add = function(item, index) {
    if (util$5.isUndefined(index)) {
      index = this.nElements;
    }
    if (index < 0 || index > this.nElements || util$5.isUndefined(item)) {
      return false;
    }
    var newNode = this.createNode(item);
    if (this.nElements === 0 || this.lastNode === null) {
      this.firstNode = newNode;
      this.lastNode = newNode;
    } else if (index === this.nElements) {
      this.lastNode.next = newNode;
      this.lastNode = newNode;
    } else if (index === 0) {
      newNode.next = this.firstNode;
      this.firstNode = newNode;
    } else {
      var prev = this.nodeAtIndex(index - 1);
      if (prev === null) {
        return false;
      }
      newNode.next = prev.next;
      prev.next = newNode;
    }
    this.nElements++;
    return true;
  };
  LinkedList2.prototype.first = function() {
    if (this.firstNode !== null) {
      return this.firstNode.element;
    }
    return void 0;
  };
  LinkedList2.prototype.last = function() {
    if (this.lastNode !== null) {
      return this.lastNode.element;
    }
    return void 0;
  };
  LinkedList2.prototype.elementAtIndex = function(index) {
    var node = this.nodeAtIndex(index);
    if (node === null) {
      return void 0;
    }
    return node.element;
  };
  LinkedList2.prototype.indexOf = function(item, equalsFunction) {
    var equalsF = equalsFunction || util$5.defaultEquals;
    if (util$5.isUndefined(item)) {
      return -1;
    }
    var currentNode = this.firstNode;
    var index = 0;
    while (currentNode !== null) {
      if (equalsF(currentNode.element, item)) {
        return index;
      }
      index++;
      currentNode = currentNode.next;
    }
    return -1;
  };
  LinkedList2.prototype.contains = function(item, equalsFunction) {
    return this.indexOf(item, equalsFunction) >= 0;
  };
  LinkedList2.prototype.remove = function(item, equalsFunction) {
    var equalsF = equalsFunction || util$5.defaultEquals;
    if (this.nElements < 1 || util$5.isUndefined(item)) {
      return false;
    }
    var previous = null;
    var currentNode = this.firstNode;
    while (currentNode !== null) {
      if (equalsF(currentNode.element, item)) {
        if (previous === null) {
          this.firstNode = currentNode.next;
          if (currentNode === this.lastNode) {
            this.lastNode = null;
          }
        } else if (currentNode === this.lastNode) {
          this.lastNode = previous;
          previous.next = currentNode.next;
          currentNode.next = null;
        } else {
          previous.next = currentNode.next;
          currentNode.next = null;
        }
        this.nElements--;
        return true;
      }
      previous = currentNode;
      currentNode = currentNode.next;
    }
    return false;
  };
  LinkedList2.prototype.clear = function() {
    this.firstNode = null;
    this.lastNode = null;
    this.nElements = 0;
  };
  LinkedList2.prototype.equals = function(other, equalsFunction) {
    var eqF = equalsFunction || util$5.defaultEquals;
    if (!(other instanceof LinkedList2)) {
      return false;
    }
    if (this.size() !== other.size()) {
      return false;
    }
    return this.equalsAux(this.firstNode, other.firstNode, eqF);
  };
  LinkedList2.prototype.equalsAux = function(n1, n2, eqF) {
    while (n1 !== null && n2 !== null) {
      if (!eqF(n1.element, n2.element)) {
        return false;
      }
      n1 = n1.next;
      n2 = n2.next;
    }
    return true;
  };
  LinkedList2.prototype.removeElementAtIndex = function(index) {
    if (index < 0 || index >= this.nElements || this.firstNode === null || this.lastNode === null) {
      return void 0;
    }
    var element;
    if (this.nElements === 1) {
      element = this.firstNode.element;
      this.firstNode = null;
      this.lastNode = null;
    } else {
      var previous = this.nodeAtIndex(index - 1);
      if (previous === null) {
        element = this.firstNode.element;
        this.firstNode = this.firstNode.next;
      } else if (previous.next === this.lastNode) {
        element = this.lastNode.element;
        this.lastNode = previous;
      }
      if (previous !== null && previous.next !== null) {
        element = previous.next.element;
        previous.next = previous.next.next;
      }
    }
    this.nElements--;
    return element;
  };
  LinkedList2.prototype.forEach = function(callback) {
    var currentNode = this.firstNode;
    while (currentNode !== null) {
      if (callback(currentNode.element) === false) {
        break;
      }
      currentNode = currentNode.next;
    }
  };
  LinkedList2.prototype.reverse = function() {
    var previous = null;
    var current = this.firstNode;
    var temp = null;
    while (current !== null) {
      temp = current.next;
      current.next = previous;
      previous = current;
      current = temp;
    }
    temp = this.firstNode;
    this.firstNode = this.lastNode;
    this.lastNode = temp;
  };
  LinkedList2.prototype.toArray = function() {
    var array = [];
    var currentNode = this.firstNode;
    while (currentNode !== null) {
      array.push(currentNode.element);
      currentNode = currentNode.next;
    }
    return array;
  };
  LinkedList2.prototype.size = function() {
    return this.nElements;
  };
  LinkedList2.prototype.isEmpty = function() {
    return this.nElements <= 0;
  };
  LinkedList2.prototype.toString = function() {
    return arrays$2.toString(this.toArray());
  };
  LinkedList2.prototype.nodeAtIndex = function(index) {
    if (index < 0 || index >= this.nElements) {
      return null;
    }
    if (index === this.nElements - 1) {
      return this.lastNode;
    }
    var node = this.firstNode;
    for (var i = 0; i < index && node !== null; i++) {
      node = node.next;
    }
    return node;
  };
  LinkedList2.prototype.createNode = function(item) {
    return {
      element: item,
      next: null
    };
  };
  return LinkedList2;
}();
LinkedList$1.default = LinkedList;
Object.defineProperty(Queue$1, "__esModule", { value: true });
var LinkedList_1$2 = LinkedList$1;
var Queue = function() {
  function Queue2() {
    this.list = new LinkedList_1$2.default();
  }
  Queue2.prototype.enqueue = function(elem) {
    return this.list.add(elem);
  };
  Queue2.prototype.add = function(elem) {
    return this.list.add(elem);
  };
  Queue2.prototype.dequeue = function() {
    if (this.list.size() !== 0) {
      var el = this.list.first();
      this.list.removeElementAtIndex(0);
      return el;
    }
    return void 0;
  };
  Queue2.prototype.peek = function() {
    if (this.list.size() !== 0) {
      return this.list.first();
    }
    return void 0;
  };
  Queue2.prototype.size = function() {
    return this.list.size();
  };
  Queue2.prototype.contains = function(elem, equalsFunction) {
    return this.list.contains(elem, equalsFunction);
  };
  Queue2.prototype.isEmpty = function() {
    return this.list.size() <= 0;
  };
  Queue2.prototype.clear = function() {
    this.list.clear();
  };
  Queue2.prototype.forEach = function(callback) {
    this.list.forEach(callback);
  };
  return Queue2;
}();
Queue$1.default = Queue;
Object.defineProperty(BSTreeKV$1, "__esModule", { value: true });
var util$4 = util$a;
var Queue_1$1 = Queue$1;
var BSTreeKV = function() {
  function BSTreeKV2(compareFunction) {
    this.root = null;
    this.compare = compareFunction || util$4.defaultCompare;
    this.nElements = 0;
  }
  BSTreeKV2.prototype.add = function(element) {
    if (util$4.isUndefined(element)) {
      return false;
    }
    if (this.insertNode(this.createNode(element)) !== null) {
      this.nElements++;
      return true;
    }
    return false;
  };
  BSTreeKV2.prototype.clear = function() {
    this.root = null;
    this.nElements = 0;
  };
  BSTreeKV2.prototype.isEmpty = function() {
    return this.nElements === 0;
  };
  BSTreeKV2.prototype.size = function() {
    return this.nElements;
  };
  BSTreeKV2.prototype.contains = function(element) {
    if (util$4.isUndefined(element)) {
      return false;
    }
    return this.searchNode(this.root, element) !== null;
  };
  BSTreeKV2.prototype.search = function(element) {
    var ret = this.searchNode(this.root, element);
    if (ret === null) {
      return void 0;
    }
    return ret.element;
  };
  BSTreeKV2.prototype.remove = function(element) {
    var node = this.searchNode(this.root, element);
    if (node === null) {
      return false;
    }
    this.removeNode(node);
    this.nElements--;
    return true;
  };
  BSTreeKV2.prototype.inorderTraversal = function(callback) {
    this.inorderTraversalAux(this.root, callback, {
      stop: false
    });
  };
  BSTreeKV2.prototype.preorderTraversal = function(callback) {
    this.preorderTraversalAux(this.root, callback, {
      stop: false
    });
  };
  BSTreeKV2.prototype.postorderTraversal = function(callback) {
    this.postorderTraversalAux(this.root, callback, {
      stop: false
    });
  };
  BSTreeKV2.prototype.levelTraversal = function(callback) {
    this.levelTraversalAux(this.root, callback);
  };
  BSTreeKV2.prototype.minimum = function() {
    if (this.isEmpty() || this.root === null) {
      return void 0;
    }
    return this.minimumAux(this.root).element;
  };
  BSTreeKV2.prototype.maximum = function() {
    if (this.isEmpty() || this.root === null) {
      return void 0;
    }
    return this.maximumAux(this.root).element;
  };
  BSTreeKV2.prototype.forEach = function(callback) {
    this.inorderTraversal(callback);
  };
  BSTreeKV2.prototype.toArray = function() {
    var array = [];
    this.inorderTraversal(function(element) {
      array.push(element);
      return true;
    });
    return array;
  };
  BSTreeKV2.prototype.height = function() {
    return this.heightAux(this.root);
  };
  BSTreeKV2.prototype.searchNode = function(node, element) {
    var cmp = 1;
    while (node !== null && cmp !== 0) {
      cmp = this.compare(element, node.element);
      if (cmp < 0) {
        node = node.leftCh;
      } else if (cmp > 0) {
        node = node.rightCh;
      }
    }
    return node;
  };
  BSTreeKV2.prototype.transplant = function(n1, n2) {
    if (n1.parent === null) {
      this.root = n2;
    } else if (n1 === n1.parent.leftCh) {
      n1.parent.leftCh = n2;
    } else {
      n1.parent.rightCh = n2;
    }
    if (n2 !== null) {
      n2.parent = n1.parent;
    }
  };
  BSTreeKV2.prototype.removeNode = function(node) {
    if (node.leftCh === null) {
      this.transplant(node, node.rightCh);
    } else if (node.rightCh === null) {
      this.transplant(node, node.leftCh);
    } else {
      var y = this.minimumAux(node.rightCh);
      if (y.parent !== node) {
        this.transplant(y, y.rightCh);
        y.rightCh = node.rightCh;
        y.rightCh.parent = y;
      }
      this.transplant(node, y);
      y.leftCh = node.leftCh;
      y.leftCh.parent = y;
    }
  };
  BSTreeKV2.prototype.inorderTraversalAux = function(node, callback, signal) {
    if (node === null || signal.stop) {
      return;
    }
    this.inorderTraversalAux(node.leftCh, callback, signal);
    if (signal.stop) {
      return;
    }
    signal.stop = callback(node.element) === false;
    if (signal.stop) {
      return;
    }
    this.inorderTraversalAux(node.rightCh, callback, signal);
  };
  BSTreeKV2.prototype.levelTraversalAux = function(node, callback) {
    var queue = new Queue_1$1.default();
    if (node !== null) {
      queue.enqueue(node);
    }
    node = queue.dequeue() || null;
    while (node != null) {
      if (callback(node.element) === false) {
        return;
      }
      if (node.leftCh !== null) {
        queue.enqueue(node.leftCh);
      }
      if (node.rightCh !== null) {
        queue.enqueue(node.rightCh);
      }
      node = queue.dequeue() || null;
    }
  };
  BSTreeKV2.prototype.preorderTraversalAux = function(node, callback, signal) {
    if (node === null || signal.stop) {
      return;
    }
    signal.stop = callback(node.element) === false;
    if (signal.stop) {
      return;
    }
    this.preorderTraversalAux(node.leftCh, callback, signal);
    if (signal.stop) {
      return;
    }
    this.preorderTraversalAux(node.rightCh, callback, signal);
  };
  BSTreeKV2.prototype.postorderTraversalAux = function(node, callback, signal) {
    if (node === null || signal.stop) {
      return;
    }
    this.postorderTraversalAux(node.leftCh, callback, signal);
    if (signal.stop) {
      return;
    }
    this.postorderTraversalAux(node.rightCh, callback, signal);
    if (signal.stop) {
      return;
    }
    signal.stop = callback(node.element) === false;
  };
  BSTreeKV2.prototype.minimumAux = function(node) {
    while (node != null && node.leftCh !== null) {
      node = node.leftCh;
    }
    return node;
  };
  BSTreeKV2.prototype.maximumAux = function(node) {
    while (node != null && node.rightCh !== null) {
      node = node.rightCh;
    }
    return node;
  };
  BSTreeKV2.prototype.heightAux = function(node) {
    if (node === null) {
      return -1;
    }
    return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
  };
  BSTreeKV2.prototype.insertNode = function(node) {
    var parent = null;
    var position = this.root;
    while (position !== null) {
      var cmp = this.compare(node.element, position.element);
      if (cmp === 0) {
        return null;
      } else if (cmp < 0) {
        parent = position;
        position = position.leftCh;
      } else {
        parent = position;
        position = position.rightCh;
      }
    }
    node.parent = parent;
    if (parent === null) {
      this.root = node;
    } else if (this.compare(node.element, parent.element) < 0) {
      parent.leftCh = node;
    } else {
      parent.rightCh = node;
    }
    return node;
  };
  BSTreeKV2.prototype.createNode = function(element) {
    return {
      element,
      leftCh: null,
      rightCh: null,
      parent: null
    };
  };
  return BSTreeKV2;
}();
BSTreeKV$1.default = BSTreeKV;
var __extends$2 = commonjsGlobal && commonjsGlobal.__extends || function() {
  var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
    d.__proto__ = b;
  } || function(d, b) {
    for (var p2 in b)
      if (b.hasOwnProperty(p2))
        d[p2] = b[p2];
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(BSTree$1, "__esModule", { value: true });
var BSTreeKV_1$1 = BSTreeKV$1;
var BSTree = function(_super) {
  __extends$2(BSTree2, _super);
  function BSTree2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return BSTree2;
}(BSTreeKV_1$1.default);
BSTree$1.default = BSTree;
var Heap$1 = {};
Object.defineProperty(Heap$1, "__esModule", { value: true });
var collections = util$a;
var arrays$1 = arrays$4;
var Heap = function() {
  function Heap2(compareFunction) {
    this.data = [];
    this.compare = compareFunction || collections.defaultCompare;
  }
  Heap2.prototype.leftChildIndex = function(nodeIndex) {
    return 2 * nodeIndex + 1;
  };
  Heap2.prototype.rightChildIndex = function(nodeIndex) {
    return 2 * nodeIndex + 2;
  };
  Heap2.prototype.parentIndex = function(nodeIndex) {
    return Math.floor((nodeIndex - 1) / 2);
  };
  Heap2.prototype.minIndex = function(leftChild, rightChild) {
    if (rightChild >= this.data.length) {
      if (leftChild >= this.data.length) {
        return -1;
      } else {
        return leftChild;
      }
    } else {
      if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
        return leftChild;
      } else {
        return rightChild;
      }
    }
  };
  Heap2.prototype.siftUp = function(index) {
    var parent = this.parentIndex(index);
    while (index > 0 && this.compare(this.data[parent], this.data[index]) > 0) {
      arrays$1.swap(this.data, parent, index);
      index = parent;
      parent = this.parentIndex(index);
    }
  };
  Heap2.prototype.siftDown = function(nodeIndex) {
    var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
    while (min >= 0 && this.compare(this.data[nodeIndex], this.data[min]) > 0) {
      arrays$1.swap(this.data, min, nodeIndex);
      nodeIndex = min;
      min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
    }
  };
  Heap2.prototype.peek = function() {
    if (this.data.length > 0) {
      return this.data[0];
    } else {
      return void 0;
    }
  };
  Heap2.prototype.add = function(element) {
    if (collections.isUndefined(element)) {
      return false;
    }
    this.data.push(element);
    this.siftUp(this.data.length - 1);
    return true;
  };
  Heap2.prototype.removeRoot = function() {
    if (this.data.length > 0) {
      var obj = this.data[0];
      this.data[0] = this.data[this.data.length - 1];
      this.data.splice(this.data.length - 1, 1);
      if (this.data.length > 0) {
        this.siftDown(0);
      }
      return obj;
    }
    return void 0;
  };
  Heap2.prototype.contains = function(element) {
    var equF = collections.compareToEquals(this.compare);
    return arrays$1.contains(this.data, element, equF);
  };
  Heap2.prototype.size = function() {
    return this.data.length;
  };
  Heap2.prototype.isEmpty = function() {
    return this.data.length <= 0;
  };
  Heap2.prototype.clear = function() {
    this.data.length = 0;
  };
  Heap2.prototype.forEach = function(callback) {
    arrays$1.forEach(this.data, callback);
  };
  return Heap2;
}();
Heap$1.default = Heap;
var LinkedDictionary$1 = {};
var __extends$1 = commonjsGlobal && commonjsGlobal.__extends || function() {
  var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
    d.__proto__ = b;
  } || function(d, b) {
    for (var p2 in b)
      if (b.hasOwnProperty(p2))
        d[p2] = b[p2];
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(LinkedDictionary$1, "__esModule", { value: true });
var Dictionary_1$3 = Dictionary$2;
var util$3 = util$a;
var LinkedDictionaryPair = function() {
  function LinkedDictionaryPair2(key, value) {
    this.key = key;
    this.value = value;
  }
  LinkedDictionaryPair2.prototype.unlink = function() {
    this.prev.next = this.next;
    this.next.prev = this.prev;
  };
  return LinkedDictionaryPair2;
}();
var HeadOrTailLinkedDictionaryPair = function() {
  function HeadOrTailLinkedDictionaryPair2() {
    this.key = null;
    this.value = null;
  }
  HeadOrTailLinkedDictionaryPair2.prototype.unlink = function() {
    this.prev.next = this.next;
    this.next.prev = this.prev;
  };
  return HeadOrTailLinkedDictionaryPair2;
}();
function isHeadOrTailLinkedDictionaryPair(p2) {
  return !p2.next;
}
var LinkedDictionary = function(_super) {
  __extends$1(LinkedDictionary2, _super);
  function LinkedDictionary2(toStrFunction) {
    var _this = _super.call(this, toStrFunction) || this;
    _this.head = new HeadOrTailLinkedDictionaryPair();
    _this.tail = new HeadOrTailLinkedDictionaryPair();
    _this.head.next = _this.tail;
    _this.tail.prev = _this.head;
    return _this;
  }
  LinkedDictionary2.prototype.appendToTail = function(entry) {
    var lastNode = this.tail.prev;
    lastNode.next = entry;
    entry.prev = lastNode;
    entry.next = this.tail;
    this.tail.prev = entry;
  };
  LinkedDictionary2.prototype.getLinkedDictionaryPair = function(key) {
    if (util$3.isUndefined(key)) {
      return void 0;
    }
    var k = "$" + this.toStr(key);
    var pair = this.table[k];
    return pair;
  };
  LinkedDictionary2.prototype.getValue = function(key) {
    var pair = this.getLinkedDictionaryPair(key);
    if (!util$3.isUndefined(pair)) {
      return pair.value;
    }
    return void 0;
  };
  LinkedDictionary2.prototype.remove = function(key) {
    var pair = this.getLinkedDictionaryPair(key);
    if (!util$3.isUndefined(pair)) {
      _super.prototype.remove.call(this, key);
      pair.unlink();
      return pair.value;
    }
    return void 0;
  };
  LinkedDictionary2.prototype.clear = function() {
    _super.prototype.clear.call(this);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  };
  LinkedDictionary2.prototype.replace = function(oldPair, newPair) {
    var k = "$" + this.toStr(newPair.key);
    newPair.next = oldPair.next;
    newPair.prev = oldPair.prev;
    this.remove(oldPair.key);
    newPair.prev.next = newPair;
    newPair.next.prev = newPair;
    this.table[k] = newPair;
    ++this.nElements;
  };
  LinkedDictionary2.prototype.setValue = function(key, value) {
    if (util$3.isUndefined(key) || util$3.isUndefined(value)) {
      return void 0;
    }
    var existingPair = this.getLinkedDictionaryPair(key);
    var newPair = new LinkedDictionaryPair(key, value);
    var k = "$" + this.toStr(key);
    if (!util$3.isUndefined(existingPair)) {
      this.replace(existingPair, newPair);
      return existingPair.value;
    } else {
      this.appendToTail(newPair);
      this.table[k] = newPair;
      ++this.nElements;
      return void 0;
    }
  };
  LinkedDictionary2.prototype.keys = function() {
    var array = [];
    this.forEach(function(key, value) {
      array.push(key);
    });
    return array;
  };
  LinkedDictionary2.prototype.values = function() {
    var array = [];
    this.forEach(function(key, value) {
      array.push(value);
    });
    return array;
  };
  LinkedDictionary2.prototype.forEach = function(callback) {
    var crawlNode = this.head.next;
    while (!isHeadOrTailLinkedDictionaryPair(crawlNode)) {
      var ret = callback(crawlNode.key, crawlNode.value);
      if (ret === false) {
        return;
      }
      crawlNode = crawlNode.next;
    }
  };
  return LinkedDictionary2;
}(Dictionary_1$3.default);
LinkedDictionary$1.default = LinkedDictionary;
var MultiDictionary$1 = {};
Object.defineProperty(MultiDictionary$1, "__esModule", { value: true });
var util$2 = util$a;
var Dictionary_1$2 = Dictionary$2;
var arrays = arrays$4;
var MultiDictionary = function() {
  function MultiDictionary2(toStrFunction, valuesEqualsFunction, allowDuplicateValues) {
    if (allowDuplicateValues === void 0) {
      allowDuplicateValues = false;
    }
    this.dict = new Dictionary_1$2.default(toStrFunction);
    this.equalsF = valuesEqualsFunction || util$2.defaultEquals;
    this.allowDuplicate = allowDuplicateValues;
  }
  MultiDictionary2.prototype.getValue = function(key) {
    var values = this.dict.getValue(key);
    if (util$2.isUndefined(values)) {
      return [];
    }
    return arrays.copy(values);
  };
  MultiDictionary2.prototype.setValue = function(key, value) {
    if (util$2.isUndefined(key) || util$2.isUndefined(value)) {
      return false;
    }
    var array = this.dict.getValue(key);
    if (util$2.isUndefined(array)) {
      this.dict.setValue(key, [value]);
      return true;
    }
    if (!this.allowDuplicate) {
      if (arrays.contains(array, value, this.equalsF)) {
        return false;
      }
    }
    array.push(value);
    return true;
  };
  MultiDictionary2.prototype.remove = function(key, value) {
    if (util$2.isUndefined(value)) {
      var v = this.dict.remove(key);
      return !util$2.isUndefined(v);
    }
    var array = this.dict.getValue(key);
    if (!util$2.isUndefined(array) && arrays.remove(array, value, this.equalsF)) {
      if (array.length === 0) {
        this.dict.remove(key);
      }
      return true;
    }
    return false;
  };
  MultiDictionary2.prototype.keys = function() {
    return this.dict.keys();
  };
  MultiDictionary2.prototype.values = function() {
    var values = this.dict.values();
    var array = [];
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
      var v = values_1[_i];
      for (var _a = 0, v_1 = v; _a < v_1.length; _a++) {
        var w = v_1[_a];
        array.push(w);
      }
    }
    return array;
  };
  MultiDictionary2.prototype.containsKey = function(key) {
    return this.dict.containsKey(key);
  };
  MultiDictionary2.prototype.clear = function() {
    this.dict.clear();
  };
  MultiDictionary2.prototype.size = function() {
    return this.dict.size();
  };
  MultiDictionary2.prototype.isEmpty = function() {
    return this.dict.isEmpty();
  };
  return MultiDictionary2;
}();
MultiDictionary$1.default = MultiDictionary;
var FactoryDictionary$1 = {};
var __extends = commonjsGlobal && commonjsGlobal.__extends || function() {
  var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
    d.__proto__ = b;
  } || function(d, b) {
    for (var p2 in b)
      if (b.hasOwnProperty(p2))
        d[p2] = b[p2];
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(FactoryDictionary$1, "__esModule", { value: true });
var Dictionary_1$1 = Dictionary$2;
var util$1 = util$a;
var FactoryDictionary = function(_super) {
  __extends(FactoryDictionary2, _super);
  function FactoryDictionary2(defaultFactoryFunction, toStrFunction) {
    var _this = _super.call(this, toStrFunction) || this;
    _this.defaultFactoryFunction = defaultFactoryFunction;
    return _this;
  }
  FactoryDictionary2.prototype.setDefault = function(key, defaultValue) {
    var currentValue = _super.prototype.getValue.call(this, key);
    if (util$1.isUndefined(currentValue)) {
      this.setValue(key, defaultValue);
      return defaultValue;
    }
    return currentValue;
  };
  FactoryDictionary2.prototype.getValue = function(key) {
    return this.setDefault(key, this.defaultFactoryFunction());
  };
  return FactoryDictionary2;
}(Dictionary_1$1.default);
FactoryDictionary$1.default = FactoryDictionary;
var PriorityQueue$1 = {};
Object.defineProperty(PriorityQueue$1, "__esModule", { value: true });
var util = util$a;
var Heap_1$1 = Heap$1;
var PriorityQueue = function() {
  function PriorityQueue2(compareFunction) {
    this.heap = new Heap_1$1.default(util.reverseCompareFunction(compareFunction));
  }
  PriorityQueue2.prototype.enqueue = function(element) {
    return this.heap.add(element);
  };
  PriorityQueue2.prototype.add = function(element) {
    return this.heap.add(element);
  };
  PriorityQueue2.prototype.dequeue = function() {
    if (this.heap.size() !== 0) {
      var el = this.heap.peek();
      this.heap.removeRoot();
      return el;
    }
    return void 0;
  };
  PriorityQueue2.prototype.peek = function() {
    return this.heap.peek();
  };
  PriorityQueue2.prototype.contains = function(element) {
    return this.heap.contains(element);
  };
  PriorityQueue2.prototype.isEmpty = function() {
    return this.heap.isEmpty();
  };
  PriorityQueue2.prototype.size = function() {
    return this.heap.size();
  };
  PriorityQueue2.prototype.clear = function() {
    this.heap.clear();
  };
  PriorityQueue2.prototype.forEach = function(callback) {
    this.heap.forEach(callback);
  };
  return PriorityQueue2;
}();
PriorityQueue$1.default = PriorityQueue;
var Stack$1 = {};
Object.defineProperty(Stack$1, "__esModule", { value: true });
var LinkedList_1$1 = LinkedList$1;
var Stack = function() {
  function Stack2() {
    this.list = new LinkedList_1$1.default();
  }
  Stack2.prototype.push = function(elem) {
    return this.list.add(elem, 0);
  };
  Stack2.prototype.add = function(elem) {
    return this.list.add(elem, 0);
  };
  Stack2.prototype.pop = function() {
    return this.list.removeElementAtIndex(0);
  };
  Stack2.prototype.peek = function() {
    return this.list.first();
  };
  Stack2.prototype.size = function() {
    return this.list.size();
  };
  Stack2.prototype.contains = function(elem, equalsFunction) {
    return this.list.contains(elem, equalsFunction);
  };
  Stack2.prototype.isEmpty = function() {
    return this.list.isEmpty();
  };
  Stack2.prototype.clear = function() {
    this.list.clear();
  };
  Stack2.prototype.forEach = function(callback) {
    this.list.forEach(callback);
  };
  return Stack2;
}();
Stack$1.default = Stack;
var MultiRootTree$1 = {};
Object.defineProperty(MultiRootTree$1, "__esModule", { value: true });
var Direction;
(function(Direction2) {
  Direction2[Direction2["BEFORE"] = 0] = "BEFORE";
  Direction2[Direction2["AFTER"] = 1] = "AFTER";
  Direction2[Direction2["INSIDE_AT_END"] = 2] = "INSIDE_AT_END";
  Direction2[Direction2["INSIDE_AT_START"] = 3] = "INSIDE_AT_START";
})(Direction || (Direction = {}));
var MultiRootTree = function() {
  function MultiRootTree2(rootIds, nodes) {
    if (rootIds === void 0) {
      rootIds = [];
    }
    if (nodes === void 0) {
      nodes = {};
    }
    this.rootIds = rootIds;
    this.nodes = nodes;
    this.initRootIds();
    this.initNodes();
  }
  MultiRootTree2.prototype.initRootIds = function() {
    for (var _i = 0, _a = this.rootIds; _i < _a.length; _i++) {
      var rootId = _a[_i];
      this.createEmptyNodeIfNotExist(rootId);
    }
  };
  MultiRootTree2.prototype.initNodes = function() {
    for (var nodeKey in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeKey)) {
        for (var _i = 0, _a = this.nodes[nodeKey]; _i < _a.length; _i++) {
          var nodeListItem = _a[_i];
          this.createEmptyNodeIfNotExist(nodeListItem);
        }
      }
    }
  };
  MultiRootTree2.prototype.createEmptyNodeIfNotExist = function(nodeKey) {
    if (!this.nodes[nodeKey]) {
      this.nodes[nodeKey] = [];
    }
  };
  MultiRootTree2.prototype.getRootIds = function() {
    var clone = this.rootIds.slice();
    return clone;
  };
  MultiRootTree2.prototype.getNodes = function() {
    var clone = {};
    for (var nodeKey in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeKey)) {
        clone[nodeKey] = this.nodes[nodeKey].slice();
      }
    }
    return clone;
  };
  MultiRootTree2.prototype.getObject = function() {
    return {
      rootIds: this.getRootIds(),
      nodes: this.getNodes()
    };
  };
  MultiRootTree2.prototype.toObject = function() {
    return this.getObject();
  };
  MultiRootTree2.prototype.flatten = function() {
    var _this = this;
    var extraPropsObject = [];
    for (var i = 0; i < this.rootIds.length; i++) {
      var rootId = this.rootIds[i];
      extraPropsObject.push({
        id: rootId,
        level: 0,
        hasParent: false,
        childrenCount: 0
      });
      traverse(rootId, this.nodes, extraPropsObject, 0);
    }
    for (var _i = 0, extraPropsObject_1 = extraPropsObject; _i < extraPropsObject_1.length; _i++) {
      var o = extraPropsObject_1[_i];
      o.childrenCount = countChildren(o.id);
    }
    return extraPropsObject;
    function countChildren(id) {
      if (!_this.nodes[id]) {
        return 0;
      } else {
        var childrenCount = _this.nodes[id].length;
        return childrenCount;
      }
    }
    function traverse(startId, nodes, returnArray, level) {
      if (level === void 0) {
        level = 0;
      }
      if (!startId || !nodes || !returnArray || !nodes[startId]) {
        return;
      }
      level++;
      var idsList = nodes[startId];
      for (var i2 = 0; i2 < idsList.length; i2++) {
        var id = idsList[i2];
        returnArray.push({ id, level, hasParent: true });
        traverse(id, nodes, returnArray, level);
      }
      level--;
    }
  };
  MultiRootTree2.prototype.moveIdBeforeId = function(moveId, beforeId) {
    return this.moveId(moveId, beforeId, Direction.BEFORE);
  };
  MultiRootTree2.prototype.moveIdAfterId = function(moveId, afterId) {
    return this.moveId(moveId, afterId, Direction.AFTER);
  };
  MultiRootTree2.prototype.moveIdIntoId = function(moveId, insideId, atStart) {
    if (atStart === void 0) {
      atStart = true;
    }
    if (atStart) {
      return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
    } else {
      return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
    }
  };
  MultiRootTree2.prototype.swapRootIdWithRootId = function(rootId, withRootId) {
    var leftIndex = this.findRootId(rootId);
    var rightIndex = this.findRootId(withRootId);
    this.swapRootPositionWithRootPosition(leftIndex, rightIndex);
  };
  MultiRootTree2.prototype.swapRootPositionWithRootPosition = function(swapRootPosition, withRootPosition) {
    var temp = this.rootIds[withRootPosition];
    this.rootIds[withRootPosition] = this.rootIds[swapRootPosition];
    this.rootIds[swapRootPosition] = temp;
  };
  MultiRootTree2.prototype.deleteId = function(id) {
    this.rootDeleteId(id);
    this.nodeAndSubNodesDelete(id);
    this.nodeRefrencesDelete(id);
  };
  MultiRootTree2.prototype.insertIdBeforeId = function(beforeId, insertId) {
    var foundRootIdIndex = this.findRootId(beforeId);
    if (foundRootIdIndex > -1) {
      this.insertIdIntoRoot(insertId, foundRootIdIndex);
    }
    for (var nodeKey in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeKey)) {
        var foundNodeIdIndex = this.findNodeId(nodeKey, beforeId);
        if (foundNodeIdIndex > -1) {
          this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex);
        }
      }
    }
  };
  MultiRootTree2.prototype.insertIdAfterId = function(belowId, insertId) {
    var foundRootIdIndex = this.findRootId(belowId);
    if (foundRootIdIndex > -1) {
      this.insertIdIntoRoot(insertId, foundRootIdIndex + 1);
    }
    for (var nodeKey in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeKey)) {
        var foundNodeIdIndex = this.findNodeId(nodeKey, belowId);
        if (foundNodeIdIndex > -1) {
          this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex + 1);
        }
      }
    }
  };
  MultiRootTree2.prototype.insertIdIntoId = function(insideId, insertId) {
    this.nodeInsertAtEnd(insideId, insertId);
    this.nodes[insertId] = [];
  };
  MultiRootTree2.prototype.insertIdIntoRoot = function(id, position) {
    if (position === void 0) {
      this.rootInsertAtEnd(id);
    } else {
      if (position < 0) {
        var length_1 = this.rootIds.length;
        this.rootIds.splice(position + length_1 + 1, 0, id);
      } else {
        this.rootIds.splice(position, 0, id);
      }
    }
    this.nodes[id] = this.nodes[id] || [];
  };
  MultiRootTree2.prototype.insertIdIntoNode = function(nodeKey, id, position) {
    this.nodes[nodeKey] = this.nodes[nodeKey] || [];
    this.nodes[id] = this.nodes[id] || [];
    if (position === void 0) {
      this.nodeInsertAtEnd(nodeKey, id);
    } else {
      if (position < 0) {
        var length_2 = this.nodes[nodeKey].length;
        this.nodes[nodeKey].splice(position + length_2 + 1, 0, id);
      } else {
        this.nodes[nodeKey].splice(position, 0, id);
      }
    }
  };
  MultiRootTree2.prototype.moveId = function(moveId, beforeId, direction) {
    var sourceId = moveId;
    var sourceRootIndex = this.findRootId(sourceId);
    if (this.nodes[beforeId])
      ;
    for (var nodeKey in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeKey)) {
        this.findNodeId(nodeKey, beforeId);
        break;
      }
    }
    var targetId = beforeId;
    var targetRootIndex = this.findRootId(targetId);
    if (this.nodes[beforeId])
      ;
    for (var nodeKey in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeKey)) {
        this.findNodeId(nodeKey, beforeId);
        break;
      }
    }
    if (sourceRootIndex > -1) {
      if (targetRootIndex > -1) {
        this.rootDelete(sourceRootIndex);
        if (targetRootIndex > sourceRootIndex) {
          targetRootIndex--;
        }
        switch (direction) {
          case Direction.BEFORE:
            this.insertIdIntoRoot(sourceId, targetRootIndex);
            break;
          case Direction.AFTER:
            this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
            break;
          case Direction.INSIDE_AT_START:
            this.nodeInsertAtStart(targetId, sourceId);
            break;
          case Direction.INSIDE_AT_END:
            this.nodeInsertAtEnd(targetId, sourceId);
            break;
        }
      } else {
        this.rootDelete(sourceRootIndex);
        for (var nodeKey in this.nodes) {
          if (this.nodes.hasOwnProperty(nodeKey)) {
            var index = this.findNodeId(nodeKey, targetId);
            if (index > -1) {
              switch (direction) {
                case Direction.BEFORE:
                  this.insertIdIntoNode(nodeKey, sourceId, index);
                  break;
                case Direction.AFTER:
                  this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                  break;
                case Direction.INSIDE_AT_START:
                  this.nodeInsertAtStart(targetId, sourceId);
                  break;
                case Direction.INSIDE_AT_END:
                  this.nodeInsertAtEnd(targetId, sourceId);
                  break;
              }
              break;
            }
          }
        }
      }
    } else {
      if (targetRootIndex > -1) {
        for (var nodeKey in this.nodes) {
          if (this.nodes.hasOwnProperty(nodeKey)) {
            var index = this.findNodeId(nodeKey, sourceId);
            if (index > -1) {
              this.nodeDeleteAtIndex(nodeKey, index);
              break;
            }
          }
        }
        switch (direction) {
          case Direction.BEFORE:
            this.insertIdIntoRoot(sourceId, targetRootIndex);
            break;
          case Direction.AFTER:
            this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
            break;
          case Direction.INSIDE_AT_START:
            this.nodeInsertAtStart(targetId, sourceId);
            break;
          case Direction.INSIDE_AT_END:
            this.nodeInsertAtEnd(targetId, sourceId);
            break;
        }
      } else {
        for (var nodeKey in this.nodes) {
          if (this.nodes.hasOwnProperty(nodeKey)) {
            var index = this.findNodeId(nodeKey, sourceId);
            if (index > -1) {
              this.nodeDeleteAtIndex(nodeKey, index);
              break;
            }
          }
        }
        for (var nodeKey in this.nodes) {
          if (this.nodes.hasOwnProperty(nodeKey)) {
            var index = this.findNodeId(nodeKey, targetId);
            if (index > -1) {
              switch (direction) {
                case Direction.BEFORE:
                  this.insertIdIntoNode(nodeKey, sourceId, index);
                  break;
                case Direction.AFTER:
                  this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                  break;
                case Direction.INSIDE_AT_START:
                  this.nodeInsertAtStart(targetId, sourceId);
                  break;
                case Direction.INSIDE_AT_END:
                  this.nodeInsertAtEnd(targetId, sourceId);
                  break;
              }
              break;
            }
          }
        }
      }
    }
  };
  MultiRootTree2.prototype.swapArrayElements = function(arr, indexA, indexB) {
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
    return arr;
  };
  MultiRootTree2.prototype.rootDeleteId = function(id) {
    var index = this.findRootId(id);
    if (index > -1) {
      this.rootDelete(index);
    }
  };
  MultiRootTree2.prototype.nodeAndSubNodesDelete = function(nodeKey) {
    var toDeleteLater = [];
    for (var i = 0; i < this.nodes[nodeKey].length; i++) {
      var id = this.nodes[nodeKey][i];
      this.nodeAndSubNodesDelete(id);
      toDeleteLater.push(nodeKey);
    }
    this.nodeDelete(nodeKey);
    for (var i = 0; i < toDeleteLater.length; i++) {
      this.nodeDelete(toDeleteLater[i]);
    }
  };
  MultiRootTree2.prototype.nodeRefrencesDelete = function(id) {
    for (var nodeKey in this.nodes) {
      if (this.nodes.hasOwnProperty(nodeKey)) {
        for (var i = 0; i < this.nodes[nodeKey].length; i++) {
          var targetId = this.nodes[nodeKey][i];
          if (targetId === id) {
            this.nodeDeleteAtIndex(nodeKey, i);
          }
        }
      }
    }
  };
  MultiRootTree2.prototype.nodeDelete = function(nodeKey) {
    delete this.nodes[nodeKey];
  };
  MultiRootTree2.prototype.findRootId = function(id) {
    return this.rootIds.indexOf(id);
  };
  MultiRootTree2.prototype.findNodeId = function(nodeKey, id) {
    return this.nodes[nodeKey].indexOf(id);
  };
  MultiRootTree2.prototype.findNode = function(nodeKey) {
    return this.nodes[nodeKey];
  };
  MultiRootTree2.prototype.nodeInsertAtStart = function(nodeKey, id) {
    this.nodes[nodeKey].unshift(id);
  };
  MultiRootTree2.prototype.nodeInsertAtEnd = function(nodeKey, id) {
    this.nodes[nodeKey].push(id);
  };
  MultiRootTree2.prototype.rootDelete = function(index) {
    this.rootIds.splice(index, 1);
  };
  MultiRootTree2.prototype.nodeDeleteAtIndex = function(nodeKey, index) {
    this.nodes[nodeKey].splice(index, 1);
  };
  MultiRootTree2.prototype.rootInsertAtStart = function(id) {
    this.rootIds.unshift(id);
  };
  MultiRootTree2.prototype.rootInsertAtEnd = function(id) {
    this.rootIds.push(id);
  };
  return MultiRootTree2;
}();
MultiRootTree$1.default = MultiRootTree;
Object.defineProperty(lib, "__esModule", { value: true });
var _arrays = arrays$4;
lib.arrays = _arrays;
var Bag_1 = Bag$1;
lib.Bag = Bag_1.default;
var BSTree_1 = BSTree$1;
lib.BSTree = BSTree_1.default;
var BSTreeKV_1 = BSTreeKV$1;
lib.BSTreeKV = BSTreeKV_1.default;
var Dictionary_1 = Dictionary$2;
var Dictionary = lib.Dictionary = Dictionary_1.default;
var Heap_1 = Heap$1;
lib.Heap = Heap_1.default;
var LinkedDictionary_1 = LinkedDictionary$1;
lib.LinkedDictionary = LinkedDictionary_1.default;
var LinkedList_1 = LinkedList$1;
lib.LinkedList = LinkedList_1.default;
var MultiDictionary_1 = MultiDictionary$1;
lib.MultiDictionary = MultiDictionary_1.default;
var FactoryDictionary_1 = FactoryDictionary$1;
lib.FactoryDictionary = FactoryDictionary_1.default;
var FactoryDictionary_2 = FactoryDictionary$1;
lib.DefaultDictionary = FactoryDictionary_2.default;
var Queue_1 = Queue$1;
lib.Queue = Queue_1.default;
var PriorityQueue_1 = PriorityQueue$1;
lib.PriorityQueue = PriorityQueue_1.default;
var Set_1 = _Set;
lib.Set = Set_1.default;
var Stack_1 = Stack$1;
lib.Stack = Stack_1.default;
var MultiRootTree_1 = MultiRootTree$1;
lib.MultiRootTree = MultiRootTree_1.default;
var _util = util$a;
lib.util = _util;
class WebglResource {
  constructor() {
    __publicField(this, "textureCache");
    this.textureCache = new Dictionary();
  }
  async GetImage(path) {
    if (this.textureCache.containsKey(path)) {
      return this.textureCache.getValue(path);
    }
    let texture = await GetImagePromise(path);
    this.textureCache.setValue(path, texture);
    return texture;
  }
}
const SMALLEST_UNSAFE_INTEGER = 9007199254740992;
const LARGEST_SAFE_INTEGER = SMALLEST_UNSAFE_INTEGER - 1;
const UINT32_MAX = -1 >>> 0;
const UINT32_SIZE = UINT32_MAX + 1;
const INT32_SIZE = UINT32_SIZE / 2;
const INT32_MAX = INT32_SIZE - 1;
const UINT21_SIZE = 1 << 21;
const UINT21_MAX = UINT21_SIZE - 1;
function int32(engine) {
  return engine.next() | 0;
}
function add(distribution, addend) {
  if (addend === 0) {
    return distribution;
  } else {
    return (engine) => distribution(engine) + addend;
  }
}
function int53(engine) {
  const high = engine.next() | 0;
  const low = engine.next() >>> 0;
  return (high & UINT21_MAX) * UINT32_SIZE + low + (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0);
}
function int53Full(engine) {
  while (true) {
    const high = engine.next() | 0;
    if (high & 4194304) {
      if ((high & 8388607) === 4194304 && (engine.next() | 0) === 0) {
        return SMALLEST_UNSAFE_INTEGER;
      }
    } else {
      const low = engine.next() >>> 0;
      return (high & UINT21_MAX) * UINT32_SIZE + low + (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0);
    }
  }
}
function uint32(engine) {
  return engine.next() >>> 0;
}
function uint53(engine) {
  const high = engine.next() & UINT21_MAX;
  const low = engine.next() >>> 0;
  return high * UINT32_SIZE + low;
}
function uint53Full(engine) {
  while (true) {
    const high = engine.next() | 0;
    if (high & UINT21_SIZE) {
      if ((high & UINT21_MAX) === 0 && (engine.next() | 0) === 0) {
        return SMALLEST_UNSAFE_INTEGER;
      }
    } else {
      const low = engine.next() >>> 0;
      return (high & UINT21_MAX) * UINT32_SIZE + low;
    }
  }
}
function isPowerOfTwoMinusOne(value) {
  return (value + 1 & value) === 0;
}
function bitmask(masking) {
  return (engine) => engine.next() & masking;
}
function downscaleToLoopCheckedRange(range2) {
  const extendedRange = range2 + 1;
  const maximum = extendedRange * Math.floor(UINT32_SIZE / extendedRange);
  return (engine) => {
    let value = 0;
    do {
      value = engine.next() >>> 0;
    } while (value >= maximum);
    return value % extendedRange;
  };
}
function downscaleToRange(range2) {
  if (isPowerOfTwoMinusOne(range2)) {
    return bitmask(range2);
  } else {
    return downscaleToLoopCheckedRange(range2);
  }
}
function isEvenlyDivisibleByMaxInt32(value) {
  return (value | 0) === 0;
}
function upscaleWithHighMasking(masking) {
  return (engine) => {
    const high = engine.next() & masking;
    const low = engine.next() >>> 0;
    return high * UINT32_SIZE + low;
  };
}
function upscaleToLoopCheckedRange(extendedRange) {
  const maximum = extendedRange * Math.floor(SMALLEST_UNSAFE_INTEGER / extendedRange);
  return (engine) => {
    let ret = 0;
    do {
      const high = engine.next() & UINT21_MAX;
      const low = engine.next() >>> 0;
      ret = high * UINT32_SIZE + low;
    } while (ret >= maximum);
    return ret % extendedRange;
  };
}
function upscaleWithinU53(range2) {
  const extendedRange = range2 + 1;
  if (isEvenlyDivisibleByMaxInt32(extendedRange)) {
    const highRange = (extendedRange / UINT32_SIZE | 0) - 1;
    if (isPowerOfTwoMinusOne(highRange)) {
      return upscaleWithHighMasking(highRange);
    }
  }
  return upscaleToLoopCheckedRange(extendedRange);
}
function upscaleWithinI53AndLoopCheck(min, max) {
  return (engine) => {
    let ret = 0;
    do {
      const high = engine.next() | 0;
      const low = engine.next() >>> 0;
      ret = (high & UINT21_MAX) * UINT32_SIZE + low + (high & UINT21_SIZE ? -SMALLEST_UNSAFE_INTEGER : 0);
    } while (ret < min || ret > max);
    return ret;
  };
}
function integer(min, max) {
  min = Math.floor(min);
  max = Math.floor(max);
  if (min < -SMALLEST_UNSAFE_INTEGER || !isFinite(min)) {
    throw new RangeError(`Expected min to be at least ${-SMALLEST_UNSAFE_INTEGER}`);
  } else if (max > SMALLEST_UNSAFE_INTEGER || !isFinite(max)) {
    throw new RangeError(`Expected max to be at most ${SMALLEST_UNSAFE_INTEGER}`);
  }
  const range2 = max - min;
  if (range2 <= 0 || !isFinite(range2)) {
    return () => min;
  } else if (range2 === UINT32_MAX) {
    if (min === 0) {
      return uint32;
    } else {
      return add(int32, min + INT32_SIZE);
    }
  } else if (range2 < UINT32_MAX) {
    return add(downscaleToRange(range2), min);
  } else if (range2 === LARGEST_SAFE_INTEGER) {
    return add(uint53, min);
  } else if (range2 < LARGEST_SAFE_INTEGER) {
    return add(upscaleWithinU53(range2), min);
  } else if (max - 1 - min === LARGEST_SAFE_INTEGER) {
    return add(uint53Full, min);
  } else if (min === -SMALLEST_UNSAFE_INTEGER && max === SMALLEST_UNSAFE_INTEGER) {
    return int53Full;
  } else if (min === -SMALLEST_UNSAFE_INTEGER && max === LARGEST_SAFE_INTEGER) {
    return int53;
  } else if (min === -LARGEST_SAFE_INTEGER && max === SMALLEST_UNSAFE_INTEGER) {
    return add(int53, 1);
  } else if (max === SMALLEST_UNSAFE_INTEGER) {
    return add(upscaleWithinI53AndLoopCheck(min - 1, max - 1), 1);
  } else {
    return upscaleWithinI53AndLoopCheck(min, max);
  }
}
function isLeastBitTrue(engine) {
  return (engine.next() & 1) === 1;
}
function lessThan(distribution, value) {
  return (engine) => distribution(engine) < value;
}
function probability(percentage) {
  if (percentage <= 0) {
    return () => false;
  } else if (percentage >= 1) {
    return () => true;
  } else {
    const scaled = percentage * UINT32_SIZE;
    if (scaled % 1 === 0) {
      return lessThan(int32, scaled - INT32_SIZE | 0);
    } else {
      return lessThan(uint53, Math.round(percentage * SMALLEST_UNSAFE_INTEGER));
    }
  }
}
function bool(numerator, denominator) {
  if (denominator == null) {
    if (numerator == null) {
      return isLeastBitTrue;
    }
    return probability(numerator);
  } else {
    if (numerator <= 0) {
      return () => false;
    } else if (numerator >= denominator) {
      return () => true;
    }
    return lessThan(integer(0, denominator - 1), numerator);
  }
}
function date(start, end) {
  const distribution = integer(+start, +end);
  return (engine) => new Date(distribution(engine));
}
function die(sideCount) {
  return integer(1, sideCount);
}
function dice(sideCount, dieCount) {
  const distribution = die(sideCount);
  return (engine) => {
    const result = [];
    for (let i = 0; i < dieCount; ++i) {
      result.push(distribution(engine));
    }
    return result;
  };
}
const DEFAULT_STRING_POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
function string(pool = DEFAULT_STRING_POOL) {
  const poolLength = pool.length;
  if (!poolLength) {
    throw new Error("Expected pool not to be an empty string");
  }
  const distribution = integer(0, poolLength - 1);
  return (engine, length) => {
    let result = "";
    for (let i = 0; i < length; ++i) {
      const j = distribution(engine);
      result += pool.charAt(j);
    }
    return result;
  };
}
const LOWER_HEX_POOL = "0123456789abcdef";
const lowerHex = string(LOWER_HEX_POOL);
const upperHex = string(LOWER_HEX_POOL.toUpperCase());
function hex(uppercase) {
  if (uppercase) {
    return upperHex;
  } else {
    return lowerHex;
  }
}
function convertSliceArgument(value, length) {
  if (value < 0) {
    return Math.max(value + length, 0);
  } else {
    return Math.min(value, length);
  }
}
function toInteger(value) {
  const num = +value;
  if (num < 0) {
    return Math.ceil(num);
  } else {
    return Math.floor(num);
  }
}
function pick(engine, source, begin, end) {
  const length = source.length;
  if (length === 0) {
    throw new RangeError("Cannot pick from an empty array");
  }
  const start = begin == null ? 0 : convertSliceArgument(toInteger(begin), length);
  const finish = end === void 0 ? length : convertSliceArgument(toInteger(end), length);
  if (start >= finish) {
    throw new RangeError(`Cannot pick between bounds ${start} and ${finish}`);
  }
  const distribution = integer(start, finish - 1);
  return source[distribution(engine)];
}
function multiply(distribution, multiplier) {
  if (multiplier === 1) {
    return distribution;
  } else if (multiplier === 0) {
    return () => 0;
  } else {
    return (engine) => distribution(engine) * multiplier;
  }
}
function realZeroToOneExclusive(engine) {
  return uint53(engine) / SMALLEST_UNSAFE_INTEGER;
}
function realZeroToOneInclusive(engine) {
  return uint53Full(engine) / SMALLEST_UNSAFE_INTEGER;
}
function real(min, max, inclusive = false) {
  if (!isFinite(min)) {
    throw new RangeError("Expected min to be a finite number");
  } else if (!isFinite(max)) {
    throw new RangeError("Expected max to be a finite number");
  }
  return add(multiply(inclusive ? realZeroToOneInclusive : realZeroToOneExclusive, max - min), min);
}
const sliceArray = Array.prototype.slice;
function shuffle(engine, array, downTo = 0) {
  const length = array.length;
  if (length) {
    for (let i = length - 1 >>> 0; i > downTo; --i) {
      const distribution = integer(0, i);
      const j = distribution(engine);
      if (i !== j) {
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
      }
    }
  }
  return array;
}
function sample(engine, population, sampleSize) {
  if (sampleSize < 0 || sampleSize > population.length || !isFinite(sampleSize)) {
    throw new RangeError("Expected sampleSize to be within 0 and the length of the population");
  }
  if (sampleSize === 0) {
    return [];
  }
  const clone = sliceArray.call(population);
  const length = clone.length;
  if (length === sampleSize) {
    return shuffle(engine, clone, 0);
  }
  const tailLength = length - sampleSize;
  return shuffle(engine, clone, tailLength - 1).slice(tailLength);
}
const stringRepeat = (() => {
  try {
    if ("x".repeat(3) === "xxx") {
      return (pattern, count) => pattern.repeat(count);
    }
  } catch (_) {
  }
  return (pattern, count) => {
    let result = "";
    while (count > 0) {
      if (count & 1) {
        result += pattern;
      }
      count >>= 1;
      pattern += pattern;
    }
    return result;
  };
})();
function zeroPad(text, zeroCount) {
  return stringRepeat("0", zeroCount - text.length) + text;
}
function uuid4(engine) {
  const a = engine.next() >>> 0;
  const b = engine.next() | 0;
  const c = engine.next() | 0;
  const d = engine.next() >>> 0;
  return zeroPad(a.toString(16), 8) + "-" + zeroPad((b & 65535).toString(16), 4) + "-" + zeroPad((b >> 4 & 4095 | 16384).toString(16), 4) + "-" + zeroPad((c & 16383 | 32768).toString(16), 4) + "-" + zeroPad((c >> 4 & 65535).toString(16), 4) + zeroPad(d.toString(16), 8);
}
const nativeMath = {
  next() {
    return Math.random() * UINT32_SIZE | 0;
  }
};
class Random {
  constructor(engine = nativeMath) {
    this.engine = engine;
  }
  int32() {
    return int32(this.engine);
  }
  uint32() {
    return uint32(this.engine);
  }
  uint53() {
    return uint53(this.engine);
  }
  uint53Full() {
    return uint53Full(this.engine);
  }
  int53() {
    return int53(this.engine);
  }
  int53Full() {
    return int53Full(this.engine);
  }
  integer(min, max) {
    return integer(min, max)(this.engine);
  }
  realZeroToOneInclusive() {
    return realZeroToOneInclusive(this.engine);
  }
  realZeroToOneExclusive() {
    return realZeroToOneExclusive(this.engine);
  }
  real(min, max, inclusive = false) {
    return real(min, max, inclusive)(this.engine);
  }
  bool(numerator, denominator) {
    return bool(numerator, denominator)(this.engine);
  }
  pick(source, begin, end) {
    return pick(this.engine, source, begin, end);
  }
  shuffle(array) {
    return shuffle(this.engine, array);
  }
  sample(population, sampleSize) {
    return sample(this.engine, population, sampleSize);
  }
  die(sideCount) {
    return die(sideCount)(this.engine);
  }
  dice(sideCount, dieCount) {
    return dice(sideCount, dieCount)(this.engine);
  }
  uuid4() {
    return uuid4(this.engine);
  }
  string(length, pool) {
    return string(pool)(this.engine, length);
  }
  hex(length, uppercase) {
    return hex(uppercase)(this.engine, length);
  }
  date(start, end) {
    return date(start, end)(this.engine);
  }
}
const I32Array = (() => {
  try {
    const buffer = new ArrayBuffer(4);
    const view = new Int32Array(buffer);
    view[0] = INT32_SIZE;
    if (view[0] === -INT32_SIZE) {
      return Int32Array;
    }
  } catch (_) {
  }
  return Array;
})();
function createEntropy(engine = nativeMath, length = 16) {
  const array = [];
  array.push(new Date().getTime() | 0);
  for (let i = 1; i < length; ++i) {
    array[i] = engine.next() | 0;
  }
  return array;
}
const imul = (() => {
  try {
    if (Math.imul(UINT32_MAX, 5) === -5) {
      return Math.imul;
    }
  } catch (_) {
  }
  const UINT16_MAX = 65535;
  return (a, b) => {
    const ah = a >>> 16 & UINT16_MAX;
    const al = a & UINT16_MAX;
    const bh = b >>> 16 & UINT16_MAX;
    const bl = b & UINT16_MAX;
    return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
  };
})();
const ARRAY_SIZE = 624;
const ARRAY_MAX = ARRAY_SIZE - 1;
const M = 397;
const ARRAY_SIZE_MINUS_M = ARRAY_SIZE - M;
const A = 2567483615;
class MersenneTwister19937 {
  constructor() {
    this.data = new I32Array(ARRAY_SIZE);
    this.index = 0;
    this.uses = 0;
  }
  static seed(initial) {
    return new MersenneTwister19937().seed(initial);
  }
  static seedWithArray(source) {
    return new MersenneTwister19937().seedWithArray(source);
  }
  static autoSeed() {
    return MersenneTwister19937.seedWithArray(createEntropy());
  }
  next() {
    if ((this.index | 0) >= ARRAY_SIZE) {
      refreshData(this.data);
      this.index = 0;
    }
    const value = this.data[this.index];
    this.index = this.index + 1 | 0;
    this.uses += 1;
    return temper(value) | 0;
  }
  getUseCount() {
    return this.uses;
  }
  discard(count) {
    if (count <= 0) {
      return this;
    }
    this.uses += count;
    if ((this.index | 0) >= ARRAY_SIZE) {
      refreshData(this.data);
      this.index = 0;
    }
    while (count + this.index > ARRAY_SIZE) {
      count -= ARRAY_SIZE - this.index;
      refreshData(this.data);
      this.index = 0;
    }
    this.index = this.index + count | 0;
    return this;
  }
  seed(initial) {
    let previous = 0;
    this.data[0] = previous = initial | 0;
    for (let i = 1; i < ARRAY_SIZE; i = i + 1 | 0) {
      this.data[i] = previous = imul(previous ^ previous >>> 30, 1812433253) + i | 0;
    }
    this.index = ARRAY_SIZE;
    this.uses = 0;
    return this;
  }
  seedWithArray(source) {
    this.seed(19650218);
    seedWithArray(this.data, source);
    return this;
  }
}
function refreshData(data) {
  let k = 0;
  let tmp = 0;
  for (; (k | 0) < ARRAY_SIZE_MINUS_M; k = k + 1 | 0) {
    tmp = data[k] & INT32_SIZE | data[k + 1 | 0] & INT32_MAX;
    data[k] = data[k + M | 0] ^ tmp >>> 1 ^ (tmp & 1 ? A : 0);
  }
  for (; (k | 0) < ARRAY_MAX; k = k + 1 | 0) {
    tmp = data[k] & INT32_SIZE | data[k + 1 | 0] & INT32_MAX;
    data[k] = data[k - ARRAY_SIZE_MINUS_M | 0] ^ tmp >>> 1 ^ (tmp & 1 ? A : 0);
  }
  tmp = data[ARRAY_MAX] & INT32_SIZE | data[0] & INT32_MAX;
  data[ARRAY_MAX] = data[M - 1] ^ tmp >>> 1 ^ (tmp & 1 ? A : 0);
}
function temper(value) {
  value ^= value >>> 11;
  value ^= value << 7 & 2636928640;
  value ^= value << 15 & 4022730752;
  return value ^ value >>> 18;
}
function seedWithArray(data, source) {
  let i = 1;
  let j = 0;
  const sourceLength = source.length;
  let k = Math.max(sourceLength, ARRAY_SIZE) | 0;
  let previous = data[0] | 0;
  for (; (k | 0) > 0; --k) {
    data[i] = previous = (data[i] ^ imul(previous ^ previous >>> 30, 1664525)) + (source[j] | 0) + (j | 0) | 0;
    i = i + 1 | 0;
    ++j;
    if ((i | 0) > ARRAY_MAX) {
      data[0] = data[ARRAY_MAX];
      i = 1;
    }
    if (j >= sourceLength) {
      j = 0;
    }
  }
  for (k = ARRAY_MAX; (k | 0) > 0; --k) {
    data[i] = previous = (data[i] ^ imul(previous ^ previous >>> 30, 1566083941)) - i | 0;
    i = i + 1 | 0;
    if ((i | 0) > ARRAY_MAX) {
      data[0] = data[ARRAY_MAX];
      i = 1;
    }
  }
  data[0] = INT32_SIZE;
}
class SC_Canvas {
  constructor(canvas_dom_query) {
    __publicField(this, "m_space_colonization");
    __publicField(this, "m_simple_canvas");
    __publicField(this, "m_canvas_helper");
    __publicField(this, "m_resource");
    __publicField(this, "m_rand_engine");
    {
      this.m_rand_engine = new Random(MersenneTwister19937.autoSeed());
    }
    this.m_resource = new WebglResource();
    this.m_simple_canvas = new SimpleCanvas(canvas_dom_query);
    this.m_canvas_helper = new CanvasHelper(this.m_simple_canvas.Context);
    this.m_space_colonization = new SpaceColonization(20, 100, this.m_rand_engine);
    let attractor_y = this.m_simple_canvas.ScreenHeight * 0.5;
    let attractor_spawn_rect = new Rect(this.m_simple_canvas.ScreenWidth * 0.2, 0, this.m_simple_canvas.ScreenWidth * 0.6, attractor_y);
    this.m_space_colonization.spawn_attractor(attractor_spawn_rect, 200);
    this.m_space_colonization.spawn_free_branch(this.m_simple_canvas.ScreenWidth * 0.5, this.m_simple_canvas.ScreenHeight);
    window.requestAnimationFrame(this.render.bind(this));
  }
  render() {
    this.m_canvas_helper.Clear(this.m_simple_canvas.ScreenWidth, this.m_simple_canvas.ScreenHeight);
    this.draw_candidates(this.m_space_colonization.Leaves);
    this.draw_branch(this.m_space_colonization.Branches);
    let update_branch_num = this.m_space_colonization.grow_branch();
    if (update_branch_num == 0) {
      this.on_branch_spawn_completed();
      return;
    }
    window.requestAnimationFrame(this.render.bind(this));
  }
  draw_candidates(leaves) {
    let leaves_lens = leaves.length;
    for (let l = 0; l < leaves_lens; l++) {
      let leave = leaves[l];
      this.m_canvas_helper.DrawSphere(leave.position[0], leave.position[1], 3);
    }
  }
  draw_branch(branches) {
    let branch_lens = branches.length;
    for (let i = 0; i < branch_lens; i++) {
      let branch = branches[i];
      if (branch.parent == null)
        continue;
      this.draw_leaf(branch);
    }
  }
  async draw_leaf(source_branch) {
    let spawn_leaf_length = this.m_rand_engine.integer(1, 5);
    for (let i = 0; i < spawn_leaf_length; i++) {
      let spawn_leaf_t = this.m_rand_engine.realZeroToOneExclusive();
      let spawn_position = lerp(create(), source_branch.position, source_branch.parent.position, spawn_leaf_t);
      let leaf_tex = await this.m_resource.GetImage("./assets/textures/leaf-01.png");
      let options = { base_scale: 0.5, target_scale: 1, dx: 0, dy: 0 };
      options.translation = spawn_position;
      let random_direction_x = source_branch.direction[0] + this.m_rand_engine.real(-1, 1) * Math.PI * 0.2;
      let random_direction_y = source_branch.direction[1] + this.m_rand_engine.real(-1, 1) * Math.PI * 0.2;
      let random_direction_nor = fromValues(random_direction_x, random_direction_y);
      normalize(random_direction_nor, random_direction_nor);
      options.rotation = Math.atan2(random_direction_nor[1], random_direction_nor[0]);
      options.dy = -leaf_tex.height * 0.5 * options.base_scale * options.target_scale;
      this.m_canvas_helper.DrawImage(leaf_tex, spawn_position, options);
    }
  }
  async on_branch_spawn_completed() {
    this.m_space_colonization.calculate_branch_width();
    this.m_canvas_helper.Clear(this.m_simple_canvas.ScreenWidth, this.m_simple_canvas.ScreenHeight);
    this.draw_branch(this.m_space_colonization.Branches);
  }
}
new SC_Canvas("#canvas_board");
