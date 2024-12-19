import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog, Button, TextInput } from "react-native-paper";

type EditLogDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  handleDeletePress: (log: any) => Promise<void>;
  editingLog: any;
  handleEditConfirm: (weight: string, reps: string) => void;
};

const EditLogDialog: React.FC<EditLogDialogProps> = ({
  visible,
  onDismiss,
  handleDeletePress,
  editingLog,
  handleEditConfirm,
}) => {
  const [editWeight, setEditWeight] = useState("");
  const [editReps, setEditReps] = useState("");

  useEffect(() => {
    if (editingLog) {
      setEditWeight(editingLog.weight.toString());
      setEditReps(editingLog.reps.toString());
    }
  }, [editingLog]);

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Edit Log</Dialog.Title>
      <Dialog.Content style={{ gap: 8 }}>
        <TextInput
          label="Weight"
          value={editWeight}
          onChangeText={setEditWeight}
          right={<TextInput.Affix text="kg" />}
        />
        <TextInput
          label="Reps"
          value={editReps}
          onChangeText={setEditReps}
          right={<TextInput.Affix text="reps" />}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          textColor="red"
          onPress={async () => {
            if (!editingLog) {
              return;
            }
            await handleDeletePress(editingLog);
            onDismiss();
          }}
        >
          Delete
        </Button>

        <View style={{ flex: 1 }} />
        <Button onPress={onDismiss}>Cancel</Button>
        <Button onPress={() => handleEditConfirm(editWeight, editReps)}>
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default EditLogDialog;
