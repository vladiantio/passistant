function MessageLoading() {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <circle cx="8" cy="12" r="6" opacity="1">
        <animate id="spinner_qYjJ" begin="0;spinner_t4KZ.end-0.25s" attributeName="opacity" dur="1.5s" values="1;.25;1" fill="freeze"/>
      </circle>
      <circle cx="24" cy="12" r="6" opacity=".4">
        <animate begin="spinner_qYjJ.begin+0.15s" attributeName="opacity" dur="1.5s" values="1;.25;1" fill="freeze"/>
      </circle>
      <circle cx="40" cy="12" r="6" opacity=".3">
        <animate id="spinner_t4KZ" begin="spinner_qYjJ.begin+0.3s" attributeName="opacity" dur="1.5s" values="1;.25;1" fill="freeze"/>
      </circle>
    </svg>
  )
}

export { MessageLoading }
