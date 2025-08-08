const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openChatWindow: (ticketId, ticketData) => ipcRenderer.invoke('open-chat-window', ticketId, ticketData),
  openTicketDetailWindow: (ticketId, ticketData) => ipcRenderer.invoke('open-ticket-detail-window', ticketId, ticketData),
  openFileWindow: (fileUrl, fileName) => ipcRenderer.invoke('open-file-window', fileUrl, fileName),
  closeChatWindow: (ticketId) => ipcRenderer.invoke('close-chat-window', ticketId),
  closeCurrentWindow: () => ipcRenderer.invoke('close-current-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  isElectron: true,
}); 