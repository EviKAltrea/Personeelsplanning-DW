import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function LeaveRequestForm() {
  const [newRequest, setNewRequest] = useState("");
  const [leaveRequests, setLeaveRequests] = useState<string[]>([]);

  const handleAddRequest = async () => {
    if (newRequest.trim() === "") return;
    await addDoc(collection(db, "leaveRequests"), {
      text: newRequest,
      createdAt: new Date()
    });
    setNewRequest("");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "leaveRequests"), (snapshot) => {
      setLeaveRequests(snapshot.docs.map(doc => doc.data().text));
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Digitale Verlofaanvragen</h1>
      <Card className="mb-4">
        <CardContent className="p-4 flex gap-2 items-center">
          <Input
            placeholder="Typ hier je verlofaanvraag (bv. 3 mei - hele dag)"
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
          />
          <Button onClick={handleAddRequest}>Toevoegen</Button>
        </CardContent>
      </Card>
      <div>
        <h2 className="font-semibold mb-2">Ingediende aanvragen:</h2>
        {leaveRequests.length === 0 ? (
          <p className="text-sm text-gray-500">Nog geen aanvragen ingediend.</p>
        ) : (
          <ul className="list-disc list-inside">
            {leaveRequests.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
