export default function NotificationIcon({ className = '', outline = true, filled = false }) {
  return outline ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 101.48-.248A9.72 9.72 0 0019.266 2.5z" />
      <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a3.75 3.75 0 01-1.709 3.049l-1.048 1.047a.75.75 0 00.523 1.279h16.17a.75.75 0 00.523-1.279l-1.048-1.047A3.75 3.75 0 0118.75 9.75V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.34.14-.66.879-.66h3.75c.74 0 .879.32.879.66a2.25 2.25 0 01-4.5 0z" clipRule="evenodd" />
    </svg>
  );
}
