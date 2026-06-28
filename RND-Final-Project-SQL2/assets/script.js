"use strict";

/* =========================================================
   DATA MODEL
   ========================================================= */
const defaultSchemas = () => ([
  { nama:"roles", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"name",tipe:"VARCHAR(50)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"createdAt",tipe:"DATETIME",isPK:false,isNotNull:true,refTable:"",refCol:""}]},
  { nama:"users", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"name",tipe:"VARCHAR(100)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"email",tipe:"VARCHAR(150)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"password",tipe:"VARCHAR(255)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"roleId",tipe:"INT",isPK:false,isNotNull:true,refTable:"roles",refCol:"id"},
    {nama:"createdAt",tipe:"DATETIME",isPK:false,isNotNull:true,refTable:"",refCol:""}]},
  { nama:"categories", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"name",tipe:"VARCHAR(100)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"createdAt",tipe:"DATETIME",isPK:false,isNotNull:true,refTable:"",refCol:""}]},
  { nama:"suppliers", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"name",tipe:"VARCHAR(100)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"phone",tipe:"VARCHAR(20)",isPK:false,isNotNull:false,refTable:"",refCol:""},
    {nama:"address",tipe:"TEXT",isPK:false,isNotNull:false,refTable:"",refCol:""},
    {nama:"createdAt",tipe:"DATETIME",isPK:false,isNotNull:true,refTable:"",refCol:""}]},
  { nama:"products", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"name",tipe:"VARCHAR(150)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"barcode",tipe:"VARCHAR(100)",isPK:false,isNotNull:false,refTable:"",refCol:""},
    {nama:"price",tipe:"DECIMAL(15,2)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"stock",tipe:"INT",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"image",tipe:"VARCHAR(255)",isPK:false,isNotNull:false,refTable:"",refCol:""},
    {nama:"categoryId",tipe:"INT",isPK:false,isNotNull:false,refTable:"categories",refCol:"id"},
    {nama:"supplierId",tipe:"INT",isPK:false,isNotNull:false,refTable:"suppliers",refCol:"id"},
    {nama:"createdAt",tipe:"DATETIME",isPK:false,isNotNull:true,refTable:"",refCol:""}]},
  { nama:"customers", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"name",tipe:"VARCHAR(100)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"phone",tipe:"VARCHAR(20)",isPK:false,isNotNull:false,refTable:"",refCol:""},
    {nama:"createdAt",tipe:"DATETIME",isPK:false,isNotNull:true,refTable:"",refCol:""}]},
  { nama:"transactions", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"invoiceNo",tipe:"VARCHAR(50)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"grandTotal",tipe:"DECIMAL(15,2)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"paidAmount",tipe:"DECIMAL(15,2)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"changeAmount",tipe:"DECIMAL(15,2)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"paymentMethod",tipe:"VARCHAR(30)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"userId",tipe:"INT",isPK:false,isNotNull:true,refTable:"users",refCol:"id"},
    {nama:"customerId",tipe:"INT",isPK:false,isNotNull:false,refTable:"customers",refCol:"id"},
    {nama:"createdAt",tipe:"DATETIME",isPK:false,isNotNull:true,refTable:"",refCol:""}]},
  { nama:"transaction_items", kolom:[
    {nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""},
    {nama:"transactionId",tipe:"INT",isPK:false,isNotNull:true,refTable:"transactions",refCol:"id"},
    {nama:"productId",tipe:"INT",isPK:false,isNotNull:true,refTable:"products",refCol:"id"},
    {nama:"quantity",tipe:"INT",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"unitPrice",tipe:"DECIMAL(15,2)",isPK:false,isNotNull:true,refTable:"",refCol:""},
    {nama:"subtotal",tipe:"DECIMAL(15,2)",isPK:false,isNotNull:true,refTable:"",refCol:""}]}
]);
const defaultTestCases = () => ([
  {id:1,skenario:"Tambah produk baru dengan gambar",hasilDiharapkan:"Produk tersimpan & muncul di tabel produk dengan gambar thumbnail",status:"Berhasil",buktiGambar:[]},
  {id:2,skenario:"Proses transaksi kasir (POS)",hasilDiharapkan:"Transaksi tersimpan, stok produk berkurang, dan struk tampil",status:"Berhasil",buktiGambar:[]},
  {id:3,skenario:"Pencarian produk via barcode",hasilDiharapkan:"Produk otomatis masuk ke keranjang belanja",status:"Berhasil",buktiGambar:[]},
  {id:4,skenario:"Hapus pengguna yang ada",hasilDiharapkan:"Data pengguna terhapus dari daftar",status:"Berhasil",buktiGambar:[]},
  {id:5,skenario:"Input stok melebihi persediaan",hasilDiharapkan:"Sistem menolak & menampilkan pesan error stok tidak mencukupi",status:"Berhasil",buktiGambar:[]}
]);

let schemas = defaultSchemas();
let mockupImages = [];
let screenshotImages = [];
let testCases = defaultTestCases();
let nextTestCaseId = 5;

const STORE_KEY = "rndSQL2_final_v2";

/* =========================================================
   UTIL
   ========================================================= */
function escapeHtml(s){
  if(s===undefined||s===null) return '';
  return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
const $ = id => document.getElementById(id);

/* =========================================================
   PENYIMPANAN — IndexedDB (kuota besar) + kompres gambar
   Antisipasi "memory full": gambar dikompres, data utama di
   IndexedDB (bukan localStorage 5MB), localStorage hanya
   cadangan teks ringan.
   ========================================================= */
const IDB_NAME = "rndSQL2DB";
const IDB_STORE = "doc";
const IMG_MAX_SIZE = 1200;   // px sisi terpanjang
const IMG_QUALITY = 0.72;    // kualitas JPEG

function idbOpen(){
  return new Promise((res,rej)=>{
    if(!window.indexedDB){ rej(new Error("IndexedDB tidak tersedia")); return; }
    const req = indexedDB.open(IDB_NAME,1);
    req.onupgradeneeded = ()=>{ req.result.createObjectStore(IDB_STORE); };
    req.onsuccess = ()=>res(req.result);
    req.onerror = ()=>rej(req.error);
  });
}
function idbSet(key,val){
  return idbOpen().then(db=>new Promise((res,rej)=>{
    const tx=db.transaction(IDB_STORE,"readwrite");
    tx.objectStore(IDB_STORE).put(val,key);
    tx.oncomplete=()=>res(true);
    tx.onerror=()=>rej(tx.error);
  }));
}
function idbGet(key){
  return idbOpen().then(db=>new Promise((res,rej)=>{
    const tx=db.transaction(IDB_STORE,"readonly");
    const r=tx.objectStore(IDB_STORE).get(key);
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  }));
}

/* Kompres + resize gambar sebelum disimpan (mengembalikan dataURL JPEG) */
function compressImage(file){
  return new Promise((resolve)=>{
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        let {width:w,height:h}=img;
        if(w>h && w>IMG_MAX_SIZE){ h=Math.round(h*IMG_MAX_SIZE/w); w=IMG_MAX_SIZE; }
        else if(h>=w && h>IMG_MAX_SIZE){ w=Math.round(w*IMG_MAX_SIZE/h); h=IMG_MAX_SIZE; }
        const cv=document.createElement("canvas");
        cv.width=w; cv.height=h;
        cv.getContext("2d").drawImage(img,0,0,w,h);
        try{ resolve(cv.toDataURL("image/jpeg",IMG_QUALITY)); }
        catch(e){ resolve(ev.target.result); } // fallback bila gambar CORS/SVG
      };
      img.onerror=()=>resolve(ev.target.result);
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* Tampilkan pemakaian penyimpanan di bar atas */
function updateStorageMeter(){
  const el=$("storageMeter"); if(!el) return;
  if(navigator.storage && navigator.storage.estimate){
    navigator.storage.estimate().then(est=>{
      const usedMB=(est.usage||0)/1048576;
      const quotaMB=(est.quota||0)/1048576;
      el.textContent=`DB: ${usedMB.toFixed(1)} MB`;
      el.classList.remove("warn","full");
      if(quotaMB>0){
        const ratio=usedMB/quotaMB;
        if(ratio>0.9) el.classList.add("full");
        else if(ratio>0.7) el.classList.add("warn");
      }
    }).catch(()=>{ el.textContent="DB: ok"; });
  } else { el.textContent="DB: ok"; }
}

/* =========================================================
   DAFTAR ISI (auto)  — pakai angka romawi
   ========================================================= */
const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
function buildTOC(){
  const list = $("tocList");
  const secs = document.querySelectorAll(".section[data-toc]");
  let html = "";
  secs.forEach((s,i)=>{
    const label = s.getAttribute("data-toc");
    html += `<li><a href="#${s.id}"><span class="roman">${ROMAN[i]||(i+1)}.</span> <span>${label}</span><span class="leader"></span></a></li>`;
  });
  list.innerHTML = html;
}

/* =========================================================
   SCHEMA BUILDER
   ========================================================= */
function renderDynamicTables(){
  const container = $("daftarTabelDinamis");
  if(!container) return;
  let html = "";
  schemas.forEach((tbl,idxT)=>{
    html += `<div class="schema-row">
      <div class="row-top">
        <input type="text" class="input" style="max-width:260px;font-weight:700;" value="${escapeHtml(tbl.nama)}" onchange="updateNamaTabel(${idxT},this.value)">
        <button class="btn btn-sm btn-danger no-print" onclick="hapusTabelFunc(${idxT})">Hapus Tabel</button>
      </div>
      <div class="table-scroll"><table class="tbl"><thead><tr>
        <th>Kolom</th><th>Tipe Data</th><th class="ck">PK</th><th class="ck">Not Null</th><th>Foreign Key</th><th class="ck no-print">Aksi</th>
      </tr></thead><tbody>`;
    tbl.kolom.forEach((kol,idxK)=>{
      html += `<tr>
        <td><input class="input" value="${escapeHtml(kol.nama)}" onchange="updateKolomFunc(${idxT},${idxK},'nama',this.value)"></td>
        <td><input class="input" value="${escapeHtml(kol.tipe)}" onchange="updateKolomFunc(${idxT},${idxK},'tipe',this.value)"></td>
        <td class="ck"><input type="checkbox" ${kol.isPK?"checked":""} onchange="updateKolomFunc(${idxT},${idxK},'isPK',this.checked)"></td>
        <td class="ck"><input type="checkbox" ${kol.isNotNull?"checked":""} onchange="updateKolomFunc(${idxT},${idxK},'isNotNull',this.checked)"></td>
        <td><select class="input" onchange="updateFKFunc(${idxT},${idxK},this.value)">${generateFkOptions(tbl.nama,kol.refTable,kol.refCol)}</select></td>
        <td class="ck no-print"><button class="btn btn-sm btn-danger" onclick="hapusKolomFunc(${idxT},${idxK})">X</button></td>
      </tr>`;
    });
    html += `</tbody></table></div>
      <button class="btn btn-sm btn-light no-print" style="margin-top:10px;" onclick="tambahKolomFunc(${idxT})">+ Tambah Kolom</button>
    </div>`;
  });
  container.innerHTML = html;
  generateSQLAndPreview();
  renderDataDictionary();
}

function generateFkOptions(currentTable,curRefTable,curRefCol){
  let opts = `<option value="">— Tanpa FK —</option>`;
  schemas.forEach(t=>{
    if(t.nama===currentTable) return;
    t.kolom.forEach(k=>{
      if(k.isPK){
        const val = `${t.nama}.${k.nama}`;
        const sel = (curRefTable===t.nama&&curRefCol===k.nama)?"selected":"";
        opts += `<option value="${escapeHtml(val)}" ${sel}>${escapeHtml(val)}</option>`;
      }
    });
  });
  return opts;
}

window.updateNamaTabel=(i,v)=>{if(schemas[i])schemas[i].nama=v;renderDynamicTables();};
window.hapusTabelFunc=(i)=>{schemas.splice(i,1);renderDynamicTables();};
window.tambahKolomFunc=(i)=>{schemas[i].kolom.push({nama:"kolom_baru",tipe:"VARCHAR(100)",isPK:false,isNotNull:false,refTable:"",refCol:""});renderDynamicTables();};
window.hapusKolomFunc=(t,k)=>{schemas[t].kolom.splice(k,1);renderDynamicTables();};
window.updateKolomFunc=(t,k,f,v)=>{schemas[t].kolom[k][f]=v;renderDynamicTables();};
window.updateFKFunc=(t,k,v)=>{
  if(!v){schemas[t].kolom[k].refTable="";schemas[t].kolom[k].refCol="";}
  else{const[rt,rc]=v.split('.');schemas[t].kolom[k].refTable=rt;schemas[t].kolom[k].refCol=rc;}
  renderDynamicTables();
};

function generateSQLAndPreview(){
  let ddl="",rel="";
  schemas.forEach(t=>{
    ddl += `CREATE TABLE ${t.nama} (\n`;
    const cols=[];
    t.kolom.forEach(k=>{
      let line=`  ${k.nama} ${k.tipe}`;
      if(k.isNotNull) line+=" NOT NULL";
      if(k.isPK) line+=" PRIMARY KEY";
      cols.push(line);
    });
    t.kolom.forEach(k=>{
      if(k.refTable&&k.refCol){
        cols.push(`  FOREIGN KEY (${k.nama}) REFERENCES ${k.refTable}(${k.refCol})`);
        rel += `- ${t.nama}.${k.nama} -> ${k.refTable}.${k.refCol}\n`;
      }
    });
    ddl += cols.join(",\n")+"\n);\n\n";
  });
  $("previewDDL").textContent = ddl || "-- belum ada tabel";
  $("previewRelasi").textContent = rel || "-- tidak ada foreign key";
  $("lampiranSQL").value = `-- DDL\n${ddl}-- DML (isi data contoh di sini)\n`;
}

function renderDataDictionary(){
  const body = $("dataDictionary").querySelector("tbody");
  let html = `<tr><th>Tabel</th><th>Kolom</th><th>Tipe</th><th>Keterangan</th></tr>`;
  schemas.forEach(t=>{
    t.kolom.forEach(k=>{
      const ket=[];
      if(k.isPK) ket.push("Primary Key");
      if(k.isNotNull) ket.push("Wajib diisi");
      if(k.refTable) ket.push(`FK -> ${k.refTable}.${k.refCol}`);
      html += `<tr><td>${escapeHtml(t.nama)}</td><td>${escapeHtml(k.nama)}</td><td>${escapeHtml(k.tipe)}</td><td>${ket.join(", ")||"-"}</td></tr>`;
    });
  });
  body.innerHTML = html;
}

/* =========================================================
   TEST CASES
   ========================================================= */
function badgeFor(status){
  if(status==="Gagal") return '<span class="badge badge-fail">Gagal</span>';
  if(status==="Perbaikan") return '<span class="badge badge-fix">Perbaikan</span>';
  return '<span class="badge badge-ok">Berhasil</span>';
}
function renderTestCases(){
  const container=$("testCasesContainer");
  if(!container)return;
  let html="";
  testCases.forEach((tc,idx)=>{
    html += `<div class="tc-item">
      <div class="tc-grid">
        <div><label class="fld">Skenario Uji</label><input class="input" value="${escapeHtml(tc.skenario)}" onchange="updateTestCase(${idx},'skenario',this.value)"></div>
        <div><label class="fld">Hasil Diharapkan</label><input class="input" value="${escapeHtml(tc.hasilDiharapkan)}" onchange="updateTestCase(${idx},'hasilDiharapkan',this.value)"></div>
        <div><label class="fld">Status</label>
          <select class="input" onchange="updateTestCase(${idx},'status',this.value)">
            <option ${tc.status==='Berhasil'?'selected':''}>Berhasil</option>
            <option ${tc.status==='Gagal'?'selected':''}>Gagal</option>
            <option ${tc.status==='Perbaikan'?'selected':''}>Perbaikan</option>
          </select>
        </div>
        <div class="no-print"><button class="btn btn-sm btn-danger" onclick="hapusTestCase(${idx})">Hapus</button></div>
      </div>
      <div class="tc-bukti">
        <label class="fld">Bukti Screenshot ${badgeFor(tc.status)}</label>
        <div class="tc-thumbs" id="buktiGallery_${tc.id}"></div>
        <button type="button" class="btn btn-sm btn-light no-print" style="margin-top:8px;" onclick="tambahBuktiUji(${tc.id})">Upload Bukti</button>
      </div>
    </div>`;
  });
  container.innerHTML=html;
  testCases.forEach(tc=>{
    const g=$(`buktiGallery_${tc.id}`);
    if(!g)return;
    let h="";
    tc.buktiGambar.forEach((img,i)=>{
      h += `<div class="tc-thumb">
        <img src="${escapeHtml(img.src)}" alt="bukti">
        <input class="input" style="margin-top:6px;font-size:12px;" placeholder="Keterangan" value="${escapeHtml(img.caption)}" onchange="updateBuktiKeterangan(${tc.id},${i},this.value)">
        <button class="btn btn-sm btn-danger no-print" style="margin-top:6px;width:100%;" onclick="hapusBuktiUji(${tc.id},${i})">Hapus</button>
      </div>`;
    });
    g.innerHTML = h || '<span class="gallery-empty">Belum ada bukti. Klik "Upload Bukti".</span>';
  });
  updateProgress();
}
window.updateTestCase=(i,f,v)=>{if(testCases[i])testCases[i][f]=v;renderTestCases();};
window.hapusTestCase=(i)=>{testCases.splice(i,1);renderTestCases();};
window.tambahBuktiUji=(id)=>{
  const fi=document.createElement('input');fi.type='file';fi.accept='image/*';
  fi.onchange=e=>{const f=e.target.files[0];if(!f)return;
    compressImage(f).then(src=>{const tc=testCases.find(t=>t.id===id);if(tc){tc.buktiGambar.push({src,caption:'Bukti: '+tc.skenario});renderTestCases();}});};
  fi.click();
};
window.hapusBuktiUji=(id,i)=>{const tc=testCases.find(t=>t.id===id);if(tc){tc.buktiGambar.splice(i,1);renderTestCases();}};
window.updateBuktiKeterangan=(id,i,v)=>{const tc=testCases.find(t=>t.id===id);if(tc&&tc.buktiGambar[i]){tc.buktiGambar[i].caption=v;}};

/* =========================================================
   GALLERIES (mockup & screenshot)
   ========================================================= */
function renderGallery(containerId,arr){
  const c=$(containerId);if(!c)return;
  let h="";
  arr.forEach((item,idx)=>{
    h += `<div class="gallery-item">
      <img src="${escapeHtml(item.src)}" alt="gambar">
      <input class="input" style="margin-top:8px;font-size:13px;" placeholder="Keterangan gambar..." value="${escapeHtml(item.caption)}" onchange="updateGalleryCaption('${containerId}',${idx},this.value)">
      <button class="btn btn-sm btn-danger no-print" style="margin-top:8px;width:100%;" onclick="removeGalleryImage('${containerId}',${idx})">Hapus</button>
    </div>`;
  });
  c.innerHTML = h || '<span class="gallery-empty">Belum ada gambar.</span>';
}
function arrFor(containerId){return containerId==='mockupGalleryContainer'?mockupImages:screenshotImages;}
window.updateGalleryCaption=(cid,idx,v)=>{const a=arrFor(cid);if(a[idx])a[idx].caption=v;};
window.removeGalleryImage=(cid,idx)=>{const a=arrFor(cid);a.splice(idx,1);renderGallery(cid,a);};
function addImageToGallery(type){
  const cid = type==='mockup'?'mockupGalleryContainer':'screenshotGalleryContainer';
  const arr = arrFor(cid);
  const fi=document.createElement('input');fi.type='file';fi.accept='image/*';
  fi.onchange=e=>{const f=e.target.files[0];if(!f)return;
    compressImage(f).then(src=>{arr.push({src,caption:type==='mockup'?'Desain antarmuka':'Tampilan aplikasi'});renderGallery(cid,arr);});};
  fi.click();
}

/* =========================================================
   PRINT MIRROR — ubah input jadi teks dokumen formal
   ========================================================= */
function syncPrintMirrors(){
  document.querySelectorAll("#rndDocument input[id], #rndDocument textarea[id], #rndDocument select[id]").forEach(el=>{
    if(el.type==="checkbox"||el.type==="file") return;
    let m = el.nextElementSibling;
    if(!m || !m.classList || !m.classList.contains("print-mirror")){
      m = document.createElement("div");
      m.className="print-mirror";
      el.parentNode.insertBefore(m, el.nextSibling);
    }
    const val = (el.value||"").trim();
    m.textContent = val || "—";
  });
}

/* =========================================================
   PERSISTENCE
   ========================================================= */
function collectFormData(){
  const data={};
  document.querySelectorAll("#rndDocument input, #rndDocument textarea, #rndDocument select").forEach(el=>{
    if(el.id) data[el.id]=el.value;
  });
  data.__schemas=schemas;
  data.__mockup=mockupImages;
  data.__screenshot=screenshotImages;
  data.__testCases=testCases;
  data.__nextTestCaseId=nextTestCaseId;
  return data;
}
/* Cadangan teks-saja (tanpa gambar) ke localStorage — selalu kecil & aman */
function saveTextFallback(data){
  try{
    const lite={...data};
    lite.__mockup=[]; lite.__screenshot=[];
    lite.__testCases=(data.__testCases||[]).map(tc=>({...tc,buktiGambar:[]}));
    localStorage.setItem(STORE_KEY, JSON.stringify(lite));
  }catch(e){ /* abaikan, IDB yang utama */ }
}

function applyData(d){
  if(Array.isArray(d.__schemas)) schemas=d.__schemas;
  if(Array.isArray(d.__mockup)) mockupImages=d.__mockup;
  if(Array.isArray(d.__screenshot)) screenshotImages=d.__screenshot;
  if(Array.isArray(d.__testCases)) testCases=d.__testCases;
  if(d.__nextTestCaseId) nextTestCaseId=d.__nextTestCaseId;
  for(const k in d){
    if(k.startsWith("__")) continue;
    const el=$(k); if(el) el.value=d[k];
  }
}
function renderAll(){
  renderDynamicTables();
  renderGallery('mockupGalleryContainer',mockupImages);
  renderGallery('screenshotGalleryContainer',screenshotImages);
  renderTestCases();
  updateProgress();
}

function saveAllFormData(silent){
  const data=collectFormData();
  saveTextFallback(data); // teks selalu aman walau gambar gagal
  idbSet("main",data).then(()=>{
    updateStorageMeter();
    if(!silent) alert("Tersimpan. Semua data (termasuk gambar) tercatat di browser ini.");
  }).catch(err=>{
    console.warn("IDB simpan gagal:",err);
    updateStorageMeter();
    if(!silent) alert("Teks tersimpan, tetapi GAMBAR gagal disimpan (penyimpanan penuh).\n\nSaran: gunakan tombol Export untuk backup .json, atau kurangi/hapus gambar besar.");
  });
}

function loadAllFormData(){
  idbGet("main").then(d=>{
    if(d){ applyData(d); renderAll(); updateStorageMeter(); return; }
    // migrasi dari localStorage lama bila ada
    const raw=localStorage.getItem(STORE_KEY);
    if(raw){ try{ applyData(JSON.parse(raw)); }catch(e){ console.warn(e); } }
    renderAll(); updateStorageMeter();
  }).catch(()=>{
    const raw=localStorage.getItem(STORE_KEY);
    if(raw){ try{ applyData(JSON.parse(raw)); }catch(e){ console.warn(e); } }
    renderAll(); updateStorageMeter();
  });
}

/* ---------- EXPORT / IMPORT .json (backup portabel) ---------- */
function exportJSON(){
  const data=collectFormData();
  const nim=(data.nim||"mahasiswa").replace(/[^\w.-]/g,"_");
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`RND_SQL2_${nim}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
function importJSON(file){
  const r=new FileReader();
  r.onload=ev=>{
    try{
      const d=JSON.parse(ev.target.result);
      if(!confirm("Muat data dari file ini? Data saat ini akan tertimpa."))return;
      applyData(d); renderAll();
      saveAllFormData(true);
      alert("Data berhasil dimuat dari file .json.");
    }catch(e){ alert("File tidak valid / bukan backup RND yang benar."); }
  };
  r.readAsText(file);
}
function resetDefault(){
  if(!confirm("Yakin reset semua data ke kondisi kosong/default? Tindakan ini tidak bisa dibatalkan."))return;
  localStorage.removeItem(STORE_KEY);
  idbSet("main",null).catch(()=>{});
  schemas=defaultSchemas();mockupImages=[];screenshotImages=[];
  testCases=defaultTestCases();nextTestCaseId=5;
  document.querySelectorAll("#rndDocument input, #rndDocument textarea").forEach(el=>{
    if(el.type==='checkbox'||el.type==='file') return;
    el.value='';
  });
  $("institusi").value="Politeknik Negeri Lampung";
  renderDynamicTables();
  renderGallery('mockupGalleryContainer',mockupImages);
  renderGallery('screenshotGalleryContainer',screenshotImages);
  renderTestCases();
  updateProgress();
  updateStorageMeter();
  alert("Dokumen telah direset.");
}

/* =========================================================
   CONTOH (sample fill)
   ========================================================= */
function isiContoh(){
  if(!confirm("Isi field yang masih kosong dengan data contoh (Proyek CASHMATE)?"))return;
  const v={
    judulProyek:"CASHMATE — Aplikasi Point of Sale (POS) Berbasis Web",
    namaMahasiswa:"Desty Angelina", nim:"(isi NIM Anda)", kelasSemester:"Manajemen Informatika",
    dosenPengampu:"(isi nama dosen)", tglMulai:"2026-02-10", tglSelesai:"2026-06-22",
    latarBelakang:"Banyak usaha kecil dan menengah di Indonesia masih mengelola transaksi penjualan secara manual menggunakan catatan kertas atau spreadsheet sederhana. Hal ini menyebabkan berbagai masalah seperti pencatatan yang tidak akurat, sulitnya melacak stok barang secara real-time, serta lambatnya proses transaksi di kasir. Oleh karena itu, dibutuhkan sebuah aplikasi Point of Sale (POS) berbasis web yang terintegrasi dengan basis data relasional untuk membantu pengelolaan transaksi, manajemen stok produk, serta pelaporan penjualan secara otomatis dan efisien.",
    rumusanMasalah:"1. Bagaimana merancang basis data relasional untuk sistem kasir (POS) yang mencakup manajemen produk, transaksi, dan pengguna?\n2. Bagaimana mengimplementasikan operasi CRUD (Create, Read, Update, Delete) pada data produk, kategori, supplier, dan pengguna?\n3. Bagaimana membangun antarmuka kasir (POS) yang dapat memproses transaksi secara real-time dan mencetak struk pembelian?",
    tujuanProyek:"1. Merancang dan mengimplementasikan basis data relasional untuk aplikasi kasir dengan 8 tabel yang saling berelasi.\n2. Membangun API RESTful menggunakan Node.js dan Express.js untuk operasi CRUD pada semua entitas.\n3. Membuat antarmuka kasir (POS) yang responsif menggunakan Next.js dengan fitur keranjang belanja, kalkulasi otomatis, dan pencetakan struk.\n4. Mengintegrasikan fitur upload gambar produk dan pencarian barcode.",
    lingkupDikerjakan:"- Manajemen Produk (CRUD + upload gambar)\n- Manajemen Kategori & Supplier\n- Manajemen Pengguna (Admin & Kasir)\n- Sistem Transaksi / Kasir (POS)\n- Pencarian produk via barcode\n- Cetak struk transaksi\n- Dashboard statistik\n- Laporan stok & penjualan",
    lingkupTidak:"- Sistem autentikasi/login JWT (belum diimplementasikan)\n- Laporan pajak\n- Integrasi payment gateway\n- Aplikasi mobile native",
    targetUser:"Pemilik toko / usaha kecil-menengah, Kasir, dan Administrator sistem.",
    manfaat:"1. Mempercepat proses transaksi di kasir.\n2. Memudahkan pengelolaan stok barang secara real-time.\n3. Menghasilkan laporan penjualan otomatis untuk pengambilan keputusan bisnis.\n4. Mengurangi kesalahan pencatatan manual.",
    techStackDetail:"Arsitektur: Client-Server (Frontend terpisah dari Backend).\n- Database: MySQL 8.0 (via XAMPP / Prisma ORM)\n- Backend: Node.js v18+ dengan Express.js (REST API)\n- ORM: Prisma (schema-first, type-safe)\n- Frontend: Next.js 14 (App Router) + React\n- Styling: Tailwind CSS (dark mode)\n- Upload: Multer (penyimpanan lokal)\n- Package Manager: npm",
    folderStructureDetail:"CASHMATE/\n├── backend/\n│   ├── prisma/\n│   │   ├── schema.prisma\n│   │   └── seed.js\n│   ├── public/uploads/\n│   └── src/\n│       ├── controllers/\n│       ├── routes/\n│       ├── utils/\n│       ├── app.js\n│       └── server.js\n└── frontend/\n    └── src/\n        ├── app/\n        │   └── (dashboard)/\n        ├── components/layout/\n        └── services/",
    userFlow:"1. Buka aplikasi → Landing Page\n2. Masuk ke Dashboard → Melihat statistik\n3. Menu Produk → Tambah/Edit/Hapus produk (+ upload gambar)\n4. Menu Transaksi (POS) → Pilih produk / scan barcode → Masukkan ke keranjang → Input pembayaran → Proses → Cetak Struk\n5. Menu Laporan → Lihat riwayat transaksi dan stok menipis",
    routingTable:"GET    /api/dashboard/stats    → Statistik ringkasan\nGET    /api/products          → Daftar produk\nPOST   /api/products          → Tambah produk (multipart)\nPUT    /api/products/:id      → Edit produk\nDELETE /api/products/:id      → Hapus produk\nGET    /api/categories        → Daftar kategori\nGET    /api/suppliers         → Daftar supplier\nPOST   /api/transactions      → Proses transaksi\nGET    /api/transactions/:id  → Detail transaksi (struk)\nGET    /api/reports/sales     → Laporan penjualan\nGET    /api/reports/low-stock → Produk stok menipis",
    codeCreate:"// Prisma ORM — Buat Transaksi & Item secara atomik\nconst result = await prisma.$transaction(async (tx) => {\n  const transaction = await tx.transaction.create({\n    data: { invoiceNo, grandTotal, paidAmount, userId }\n  });\n  for (const item of items) {\n    await tx.transactionItem.create({\n      data: { transactionId: transaction.id, productId: item.id,\n              quantity: item.qty, unitPrice: item.price, subtotal: item.qty * item.price }\n    });\n    await tx.product.update({\n      where: { id: item.id },\n      data: { stock: { decrement: item.qty } }\n    });\n  }\n  return transaction;\n});",
    codeRead:"// Prisma ORM — Baca Produk dengan Relasi Kategori & Supplier\nconst products = await prisma.product.findMany({\n  include: {\n    category: { select: { id: true, name: true } },\n    supplier: { select: { id: true, name: true } }\n  },\n  orderBy: { createdAt: 'desc' }\n});\n// Setara SQL:\n// SELECT p.*, c.name AS category, s.name AS supplier\n// FROM products p\n// LEFT JOIN categories c ON p.categoryId = c.id\n// LEFT JOIN suppliers s ON p.supplierId = s.id\n// ORDER BY p.createdAt DESC;",
    codeUpdate:"// Prisma ORM — Update Produk\nconst updatedProduct = await prisma.product.update({\n  where: { id: parseInt(id, 10) },\n  data: { name, price: parseFloat(price),\n          stock: parseInt(stock, 10),\n          categoryId: categoryId ? parseInt(categoryId) : null }\n});\n// Setara SQL:\n// UPDATE products SET name=?, price=?, stock=?, categoryId=?\n// WHERE id=?;",
    codeDelete:"// Prisma ORM — Hapus Produk beserta file gambar\nconst product = await prisma.product.findUnique({ where: { id } });\nawait prisma.product.delete({ where: { id } });\nif (product.image) {\n  await fs.unlink(path.join(process.cwd(), 'public', product.image));\n}\n// Setara SQL:\n// DELETE FROM products WHERE id=?;",
    metodeHosting:"Local + Tunnel (ngrok)",
    urlHosting:"http://localhost:3000 (Frontend) | http://localhost:5000 (Backend API)",
    langkahDeploy:"1. Install Node.js, npm, dan XAMPP.\n2. Clone repository dari GitHub.\n3. Jalankan: cd backend && npm install && npx prisma db push && node prisma/seed.js && npm run dev.\n4. Jalankan: cd frontend && npm install && npm run dev.\n5. Akses http://localhost:3000.",
    konfigChange:"Lokal: DATABASE_URL=mysql://root:@localhost:3306/cashmate_db\nProduction: DATABASE_URL=mysql://user:pass@host:3306/db_name",
    ringkasanPengujian:"Seluruh fitur utama (CRUD Produk, Kategori, Supplier, Pengguna, dan Transaksi) telah diuji dan berfungsi sesuai rancangan. Pengurangan stok produk berjalan secara atomik menggunakan Prisma transaction.",
    kendalaSolusiPengujian:"Kendala 1: Prisma error ketika menggunakan 'include' dan 'select' bersamaan.\nSolusi: Menghapus 'include' dan menggunakan 'select' saja dengan mendefinisikan relasi di dalam blok 'select'.\n\nKendala 2: Upload gambar produk gagal di Windows karena perbedaan path separator.\nSolusi: Menggunakan path.join() dan process.cwd() untuk konsistensi path lintas sistem operasi.",
    kesimpulanPengujian:"Sistem dinyatakan layak dan siap digunakan. Semua skenario uji menunjukkan hasil berhasil.",
    kesimpulan:"Aplikasi CASHMATE berhasil dibangun sebagai sistem Point of Sale (POS) berbasis web dengan arsitektur client-server yang terpisah. Database relasional MySQL dengan 8 tabel yang saling berelasi berhasil diimplementasikan menggunakan Prisma ORM. Seluruh operasi CRUD berjalan dengan baik, termasuk fitur transaksi atomik yang menjamin konsistensi data stok produk.",
    saran:"1. Mengimplementasikan sistem autentikasi JWT untuk keamanan akses halaman admin.\n2. Menambahkan fitur laporan laba rugi yang lebih lengkap.\n3. Integrasi dengan payment gateway untuk transaksi non-tunai.\n4. Membangun versi Progressive Web App (PWA) agar dapat digunakan di perangkat mobile.",
    githubRepo:"https://github.com/DestyAngelina02/CASHMATE",
    pernyataanAI:"Saya menyatakan bahwa dokumen dan proyek ini merupakan hasil karya sendiri. Bantuan AI (Antigravity IDE) digunakan sebagai asisten coding dalam penulisan kode program, dan seluruh pemahaman konsep serta keputusan desain sistem merupakan hasil pemikiran sendiri."
  };
  for(const k in v){const el=$(k);if(el&&!el.value)el.value=v[k];}
  updateProgress();
  alert("Data contoh CASHMATE terisi pada field yang masih kosong. Sesuaikan Nama, NIM, dan Dosen Pengampu Anda!");
}

/* =========================================================
   PROGRESS
   ========================================================= */
function updateProgress(){
  const req=document.querySelectorAll("[data-required]");
  let filled=0;
  req.forEach(el=>{ if(el.value && el.value.trim()!=='') filled++; });
  const total=req.length||1;
  const pct=Math.round(filled/total*100);
  $("progressFill").style.width=pct+"%";
  $("progressPct").textContent=pct+"%";
}

/* =========================================================
   VALIDATE & PRINT
   ========================================================= */
function validateAndPrint(){
  const missing=[];
  document.querySelectorAll("[data-required]").forEach(el=>{
    if(!el.value || el.value.trim()===''){
      const lbl = el.getAttribute("data-label") || el.placeholder || el.id;
      missing.push(lbl);
    }
  });
  if(missing.length){
    const proceed=confirm("Ada "+missing.length+" bagian wajib yang belum diisi:\n\n- "+
      missing.slice(0,10).join("\n- ")+(missing.length>10?"\n- ...":"")+
      "\n\nTetap lanjut mencetak?");
    if(!proceed) return;
  }
  syncPrintMirrors();
  saveAllFormData(true);
  window.print();
}

/* =========================================================
   INIT
   ========================================================= */
window.addEventListener("DOMContentLoaded",()=>{
  buildTOC();
  const yr=$("copyYear"); if(yr) yr.textContent=new Date().getFullYear();
  loadAllFormData();

  $("btnTambahTabel").addEventListener("click",()=>{
    schemas.push({nama:`tabel_${schemas.length+1}`,kolom:[{nama:"id",tipe:"INT",isPK:true,isNotNull:true,refTable:"",refCol:""}]});
    renderDynamicTables();
  });
  $("btnTambahTestCase").addEventListener("click",()=>{
    testCases.push({id:nextTestCaseId++,skenario:"Skenario uji baru",hasilDiharapkan:"Deskripsikan hasil yang diharapkan",status:"Berhasil",buktiGambar:[]});
    renderTestCases();
  });
  $("simpanDataBtn").addEventListener("click",()=>saveAllFormData(false));
  $("resetBtn").addEventListener("click",resetDefault);
  $("contohBtn").addEventListener("click",isiContoh);
  $("cetakPDFBtn").addEventListener("click",validateAndPrint);
  $("exportBtn").addEventListener("click",exportJSON);
  $("importBtn").addEventListener("click",()=>$("importFile").click());
  $("importFile").addEventListener("change",e=>{ if(e.target.files[0]) importJSON(e.target.files[0]); e.target.value=""; });

  document.querySelectorAll(".btn-tambah-gambar").forEach(btn=>{
    btn.addEventListener("click",()=>addImageToGallery(btn.getAttribute("data-gallery")));
  });

  // dukung Ctrl+P agar mirror tetap tersinkron
  window.addEventListener("beforeprint", syncPrintMirrors);

  // live progress + autosave (debounced)
  let t;
  document.addEventListener("input",()=>{
    updateProgress();
    clearTimeout(t); t=setTimeout(()=>saveAllFormData(true),1200);
  });
});
