// import * as React from "react";
// import { Server } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "react-hot-toast";

// interface SFTPUploadProps {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   onUpload: (files: any[]) => void;
// }

// export function SFTPUpload({ onUpload }: SFTPUploadProps) {
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//   const [credentials, setCredentials] = React.useState({
//     host: "",
//     port: "22",
//     username: "",
//     password: "",
//     remotePath: "",
//   });

//   const handleConnect = async () => {
//     try {
//       const response = await fetch("/api/upload/sftp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentials),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Connection failed");
//       }

//       onUpload(data.files);
//       setIsDialogOpen(false);
//       toast.success("Files imported successfully from SFTP!");
//     } catch (error) {
//       console.error("SFTP connection failed:", error);
//       toast.error(
//         error instanceof Error ? error.message : "Failed to connect to SFTP"
//       );
//     }
//   };

//   return (
//     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Server className="mr-2 h-4 w-4" />
//           SFTP Upload
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Connect to SFTP Server</DialogTitle>
//           <DialogDescription>
//             Enter your SFTP server credentials to import files
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4">
//           <div>
//             <Label htmlFor="host">Host</Label>
//             <Input
//               id="host"
//               value={credentials.host}
//               onChange={(e) =>
//                 setCredentials({ ...credentials, host: e.target.value })
//               }
//               placeholder="sftp.example.com"
//             />
//           </div>
//           <div>
//             <Label htmlFor="port">Port</Label>
//             <Input
//               id="port"
//               value={credentials.port}
//               onChange={(e) =>
//                 setCredentials({ ...credentials, port: e.target.value })
//               }
//               placeholder="22"
//             />
//           </div>
//           <div>
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               value={credentials.username}
//               onChange={(e) =>
//                 setCredentials({ ...credentials, username: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={credentials.password}
//               onChange={(e) =>
//                 setCredentials({ ...credentials, password: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <Label htmlFor="remotePath">Remote Path</Label>
//             <Input
//               id="remotePath"
//               value={credentials.remotePath}
//               onChange={(e) =>
//                 setCredentials({ ...credentials, remotePath: e.target.value })
//               }
//               placeholder="/path/to/files"
//             />
//           </div>
//           <Button onClick={handleConnect}>Connect</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
