// Conceptual diagrams, not measured charts. The adjacent copy describes each project.
export default function ProjectDrawing({ name }) {
  if (name === 'SceneFlow') {
    return <div className="scene-diagram" aria-hidden="true"><span>01<br /><b>STORYBOARD</b></span><i /><span>02<br /><b>AI SEQUENCING</b></span><i /><span>03<br /><b>THE EDIT</b></span></div>;
  }

  let drawing;
  switch (name) {
    case 'FCCW CRM':
      drawing = <>
        {[12, 48, 84].map((y, i) => <g key={y}><rect x="8" y={y} width="108" height="26" rx="3" /><text x="62" y={y + 17}>{['MEMBERS', 'DONATIONS', 'EVENTS'][i]}</text><path d={`M116 ${y + 13}H157V61H200`} /></g>)}
        <rect x="200" y="26" width="190" height="70" rx="4" className="drawing-fill" />
        <text x="295" y="47">ONE SHARED RECORD</text>
        {[60, 71, 82].map(y => <path key={y} d={`M218 ${y}h13m10 0h55m15 0h58`} className="drawing-muted" />)}
      </>;
      break;
    case 'Delphi':
      drawing = <>
        <rect x="8" y="22" width="98" height="72" rx="4" /><path d="M8 39h98M21 31h3m7 0h3m7 0h3M22 53h68M22 65h48M22 77h59" className="drawing-muted" />
        <path d="M116 59h36m111 0h32" className="drawing-muted" />
        {[16, 30, 48, 65, 44, 27, 14].map((h,i) => <path key={i} d={`M${169+i*12} ${59-h/2}v${h}`} className="drawing-wave" />)}
        <path d="M316 26h77a7 7 0 0 1 7 7v41a7 7 0 0 1-7 7h-48l-17 13V81h-12a7 7 0 0 1-7-7V33a7 7 0 0 1 7-7Z" className="drawing-fill" />
        <path d="M324 44h60m-60 13h44m-44 13h52" className="drawing-muted" />
        <text x="57" y="114">WEB</text><text x="205" y="114">VOICE</text><text x="353" y="114">RESPONSE</text>
      </>;
      break;
    case 'Tally':
      drawing = <>
        {[0,1,2].map(i => <g key={i}><rect x={16+i*33} y="56" width="26" height="27" rx="2" /><path d={`M${29+i*33} 56v9`} /></g>)}
        <rect x="49" y="24" width="26" height="27" rx="2" /><path d="M62 24v9M125 62h43" />
        <path d="M196 76V34h10v42m12 0V48h10v28m12 0V58h10v18" className="drawing-fill" />
        <path d="M183 52h78" strokeDasharray="3 4" /><path d="M273 62h37" />
        <path d="M336 41a25 25 0 1 1-6 31m0 0-2-15m2 15 15-3" />
        <text x="61" y="114">INVENTORY</text><text x="223" y="114">THRESHOLD</text><text x="354" y="114">REORDER</text>
      </>;
      break;
    case 'Climate Cents':
      drawing = <>
        <path d="M15 15h230v82H15Z" className="drawing-fill" />
        <path d="m26 21 35 68m-18-68 39 68m-2-68 42 68m-3-68 42 68m-2-68 42 68m-2-68 34 54M22 40h215M22 66h215" className="drawing-muted" />
        <circle cx="100" cy="48" r="28" className="drawing-halo" /><circle cx="157" cy="68" r="20" className="drawing-halo" />
        <circle cx="100" cy="48" r="5" className="drawing-solid" /><circle cx="157" cy="68" r="4" className="drawing-solid" />
        <path d="M257 57h35" /><rect x="305" y="25" width="91" height="61" rx="4" />
        <path d="M319 65h12V53h13V43h13v14h13V36h12" />
        <text x="128" y="114">AIR QUALITY MAP</text><text x="350" y="114">LIVE READINGS</text>
      </>;
      break;
    case 'RaiseAChild':
      drawing = <>
        <ellipse cx="57" cy="28" rx="38" ry="11" /><path d="M19 28v52c0 15 76 15 76 0V28M19 45c0 15 76 15 76 0M19 62c0 15 76 15 76 0" />
        <path d="M108 59h45m104 0h42" className="drawing-muted" />
        <rect x="166" y="36" width="78" height="46" rx="4" className="drawing-fill" /><text x="205" y="64">API</text>
        <path d="M316 19h57l20 20v58h-77ZM373 19v20h20M329 53h49M329 66h36M329 79h42" />
        <text x="57" y="114">RECORDS</text><text x="205" y="114">CONNECT</text><text x="355" y="114">REPORTS</text>
      </>;
      break;
    default:
      return null;
  }
  return <div className="project-drawing" aria-hidden="true"><svg viewBox="0 0 410 125" fill="none">{drawing}</svg></div>;
}
